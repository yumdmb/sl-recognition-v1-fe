/* eslint-disable @typescript-eslint/no-require-imports */
// Focused regressions using the project's existing TypeScript compiler and Node test runner.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');

function load(file, mocks = {}) {
  const filename = path.join(root, file);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React, esModuleInterop: true },
  }).outputText;
  const fixtureModule = { exports: {} };
  vm.runInNewContext(source, {
    module: fixtureModule, exports: fixtureModule.exports, URL, Date, Map, Set, Number, Promise, setTimeout, clearTimeout,
    console: { log() {}, error() {}, warn() {} },
    require(name) {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      throw new Error(`Unexpected dependency: ${name} in ${file}`);
    },
  }, { filename });
  return fixtureModule.exports;
}

function database(handler) {
  const calls = [];
  return {
    calls,
    from(table) {
      const operations = [];
      const query = {};
      for (const method of ['select', 'eq', 'in', 'order', 'insert', 'update', 'upsert', 'delete', 'single', 'maybeSingle']) {
        query[method] = (...args) => { operations.push({ method, args }); return query; };
      }
      query.then = (resolve, reject) => Promise.resolve().then(() => {
        const call = { table, operations };
        calls.push(call);
        return { data: null, error: null, ...handler(call) };
      }).then(resolve, reject);
      return query;
    },
    storage: {
      from(bucket) {
        return {
          async remove(paths) {
            const call = { bucket, paths, storage: true };
            calls.push(call);
            return { error: null, ...handler(call) };
          },
        };
      },
    },
  };
}

function service(file, db) {
  return load(`src/lib/services/${file}.ts`, { '@/utils/supabase/client': { createClient: () => db } });
}
const op = (call, method) => call.operations?.find(item => item.method === method);

const youtube = load('src/lib/utils/youtube.ts');
for (const url of [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?feature=share&v=dQw4w9WgXcQ',
  'https://youtu.be/dQw4w9WgXcQ?t=12',
  'https://www.youtube.com/shorts/dQw4w9WgXcQ',
  'https://m.youtube.com/live/dQw4w9WgXcQ',
  'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
]) {
  test(`accepts YouTube URL: ${url}`, () => assert.equal(youtube.extractVideoId(url), 'dQw4w9WgXcQ'));
}
for (const url of [
  'https://evilyoutube.com/watch?v=dQw4w9WgXcQ',
  'https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ',
  'https://example.test/?next=youtube.com/watch?v=dQw4w9WgXcQ',
  'https://youtube.com/watch?v=bad', 'javascript:youtube.com/watch?v=dQw4w9WgXcQ', null, {},
]) {
  test(`rejects invalid YouTube URL: ${String(url)}`, () => assert.equal(youtube.extractVideoId(url), null));
}

test('restarting a tutorial preserves completed progress and uses its composite conflict key', async () => {
  const db = database(call => op(call, 'upsert') ? {} : { data: { status: 'completed', watch_position: 42 } });
  const result = await service('tutorialService', db).TutorialService.startTutorial('user', 'tutorial');
  assert.equal(result.status, 'completed');
  assert.equal(result.watch_position, 42);
  assert.equal(op(db.calls[0], 'upsert').args[1].onConflict, 'user_id,tutorial_id');
  assert.equal(op(db.calls[0], 'upsert').args[1].ignoreDuplicates, true);
});

test('tutorial completion is a single upsert and does not overwrite the resume position', async () => {
  const db = database(() => ({ data: { status: 'completed' } }));
  await service('tutorialService', db).TutorialService.markTutorialDone('user', 'tutorial');
  assert.equal(db.calls.length, 1);
  const upsert = op(db.calls[0], 'upsert');
  assert.equal(upsert.args[1].onConflict, 'user_id,tutorial_id');
  assert.equal(upsert.args[0].status, 'completed');
  assert.equal(Object.hasOwn(upsert.args[0], 'watch_position'), false);
});

test('invalid video timestamps are never sent to the database', async () => {
  const db = database(() => ({}));
  const tutorial = service('tutorialService', db).TutorialService;
  for (const value of [-1, NaN, Infinity]) await tutorial.updateWatchPosition('user', 'tutorial', value);
  assert.equal(db.calls.length, 0);
});

test('tutorial progress errors are not misrepresented as not started', async () => {
  const db = database(call => call.table === 'tutorials' ? { data: [{ id: 'tutorial' }] } : { error: new Error('offline') });
  await assert.rejects(service('tutorialService', db).TutorialService.getTutorials('user'), /offline/);
});

const questions = [
  { id: 'a', correct_answer: 'yes', options: ['yes', 'no'] },
  { id: 'b', correct_answer: 'no', options: ['yes', 'no'] },
];
for (const [name, submitted] of [
  ['duplicate', [{ questionId: 'a', answer: 'yes' }, { questionId: 'a', answer: 'yes' }]],
  ['missing', [{ questionId: 'a', answer: 'yes' }]],
  ['foreign question', [{ questionId: 'a', answer: 'yes' }, { questionId: 'foreign', answer: 'no' }]],
  ['invalid option', [{ questionId: 'a', answer: 'invalid' }, { questionId: 'b', answer: 'no' }]],
]) {
  test(`quiz rejects ${name} answers without writing progress`, async () => {
    const db = database(() => ({ data: questions }));
    await assert.rejects(service('quizService', db).QuizService.submitQuizAnswers('user', 'quiz', submitted));
    assert.equal(db.calls.some(call => call.table === 'quiz_progress'), false);
  });
}

test('an empty quiz cannot pass or save progress', async () => {
  const db = database(() => ({ data: [] }));
  await assert.rejects(service('quizService', db).QuizService.submitQuizAnswers('user', 'quiz', []), /no questions/);
  assert.equal(db.calls.length, 1);
});

test('quiz scores each question once and saves a failed attempt correctly', async () => {
  const db = database(call => call.table === 'quiz_questions' ? { data: questions } : {});
  const result = await service('quizService', db).QuizService.submitQuizAnswers('user', 'quiz', [
    { questionId: 'b', answer: 'yes' }, { questionId: 'a', answer: 'yes' },
  ]);
  assert.equal(result.score, 1);
  assert.equal(result.totalQuestions, 2);
  assert.equal(result.passed, false);
  assert.equal(op(db.calls[1], 'upsert').args[0].completed, false);
});

test('quiz list uses embedded question counts without extra count requests', async () => {
  const db = database(() => ({ data: [{ id: 'quiz', quiz_questions: [{ count: 7 }] }] }));
  const result = await service('quizService', db).QuizService.getQuizSets();
  assert.equal(result[0].questionCount, 7);
  assert.equal(db.calls.length, 1);
});

test('failed material deletion keeps its file available', async () => {
  const db = database(call => op(call, 'delete') ? { error: new Error('denied') } : { data: { file_path: 'old.pdf' } });
  await assert.rejects(service('materialService', db).deleteMaterial('material'), /denied/);
  assert.equal(db.calls.some(call => call.storage), false);
});

test('material deletion removes the record before cleaning up its file', async () => {
  const db = database(() => ({ data: { file_path: 'old.pdf' } }));
  await service('materialService', db).deleteMaterial('material');
  assert.ok(op(db.calls[1], 'delete'));
  assert.equal(db.calls[2].paths[0], 'old.pdf');
});

test('storage cleanup failure does not turn a successful deletion into a failed deletion', async () => {
  const db = database(call => call.storage ? { error: new Error('storage offline') } : { data: { file_path: 'old.pdf' } });
  await service('materialService', db).deleteMaterial('material');
});

test('material uploads reject empty, oversized, unsupported, and mismatched files', () => {
  const { validateMaterialFile } = service('materialService', database(() => ({})));
  for (const file of [
    { name: 'file.pdf', size: 0, type: 'application/pdf' },
    { name: 'file.pdf', size: 50 * 1024 * 1024 + 1, type: 'application/pdf' },
    { name: 'file.exe', size: 100, type: 'application/octet-stream' },
    { name: 'file.pdf', size: 100, type: 'text/html' },
  ]) assert.throws(() => validateMaterialFile(file));
});

test('material uploads infer MIME types when the browser does not provide one', () => {
  const { validateMaterialFile } = service('materialService', database(() => ({})));
  assert.equal(validateMaterialFile({ name: 'FILE.PDF', size: 100, type: '' }), 'application/pdf');
  assert.equal(validateMaterialFile({ name: 'video.mp4', size: 100, type: 'application/octet-stream' }), 'video/mp4');
});

test('material downloads request attachment disposition without changing preview URLs', () => {
  const options = [];
  const material = service('materialService', {
    storage: { from: () => ({ getPublicUrl: (file, opts) => {
      options.push(opts.download);
      return { data: { publicUrl: `https://storage.test/${file}${opts.download ? '?download=' : ''}` } };
    } }) },
  });
  assert.equal(material.getMaterialPublicUrl('file.pdf'), 'https://storage.test/file.pdf');
  assert.equal(material.getMaterialDownloadUrl({ file_path: 'file.pdf' }), 'https://storage.test/file.pdf?download=');
  assert.equal(material.getMaterialDownloadUrl({ download_url: 'https://external.test/file' }), 'https://external.test/file');
  assert.deepEqual(options, [false, true]);
});

test('failed watch-position writes propagate so local progress is not falsely updated', async () => {
  const db = database(() => ({ error: new Error('offline') }));
  await assert.rejects(service('tutorialService', db).TutorialService.updateWatchPosition('user', 'tutorial', 12), /offline/);
});

function learningContext(overrides = {}) {
  const state = [];
  let index = 0;
  const react = {
    createContext: () => ({ Provider: 'provider' }),
    createElement: (type, props) => ({ type, props }),
    useState(initial) {
      const slot = index++;
      if (!(slot in state)) state[slot] = initial;
      return [state[slot], value => { state[slot] = typeof value === 'function' ? value(state[slot]) : value; }];
    },
    useRef(initial) {
      const slot = index++;
      if (!(slot in state)) state[slot] = { current: initial };
      return state[slot];
    },
    useCallback: fn => fn,
  };
  const contextModule = load('src/context/LearningContext.tsx', {
    react,
    sonner: { toast: { success() {}, error() {} } },
    './AuthContext': { useAuth: () => ({ currentUser: { id: 'user', proficiency_level: null } }) },
    '@/lib/services/tutorialService': { TutorialService: overrides.tutorial || {} },
    '@/lib/services/materialService': overrides.material || {},
    '@/lib/services/quizService': { QuizService: overrides.quiz || {} },
    '@/lib/services/proficiencyTestService': {},
  });
  return () => {
    index = 0;
    return contextModule.LearningProvider({ children: null }).props.value;
  };
}

test('failed mutations propagate to callers so their forms remain open', async () => {
  const fail = async () => { throw new Error('save failed'); };
  const render = learningContext({
    tutorial: { createTutorial: fail, updateTutorial: fail, deleteTutorial: fail, startTutorial: fail, markTutorialDone: fail },
    quiz: { createQuizSet: fail, updateQuizSet: fail, deleteQuizSet: fail, createQuizQuestion: fail, updateQuizQuestion: fail, deleteQuizQuestion: fail },
    material: { createMaterial: fail, updateMaterial: fail, deleteMaterial: fail },
  });
  for (const method of ['createTutorial', 'updateTutorial', 'deleteTutorial', 'startTutorial', 'markTutorialDone',
    'createQuizSet', 'updateQuizSet', 'deleteQuizSet', 'createQuizQuestion', 'updateQuizQuestion', 'deleteQuizQuestion',
    'createMaterial', 'updateMaterial', 'deleteMaterial']) {
    await assert.rejects(render()[method]({ title: 'test' }, method === 'createMaterial' ? undefined : {}), /save failed/, method);
  }
});

test('a replacement upload failure preserves the old file and record', async () => {
  const events = [];
  const render = learningContext({ material: {
    getMaterials: async () => [{ id: 'material', file_path: 'old.pdf' }],
    uploadMaterialFile: async () => { events.push('upload'); throw new Error('upload failed'); },
    deleteMaterialFile: async () => events.push('delete'),
    updateMaterial: async () => events.push('save'),
  } });
  await render().getMaterials();
  await assert.rejects(render().updateMaterial('material', {}, { name: 'new.pdf', type: 'application/pdf' }), /upload failed/);
  assert.equal(events.join(','), 'upload');
});

test('a failed material record update cleans up only the new upload', async () => {
  const deleted = [];
  const render = learningContext({ material: {
    getMaterials: async () => [{ id: 'material', file_path: 'old.pdf' }],
    uploadMaterialFile: async () => 'new.pdf', getMaterialPublicUrl: path => path,
    updateMaterial: async () => { throw new Error('save failed'); },
    deleteMaterialFile: async path => deleted.push(path),
  } });
  await render().getMaterials();
  await assert.rejects(render().updateMaterial('material', {}, { name: 'new.pdf', type: 'application/pdf' }), /save failed/);
  assert.deepEqual(deleted, ['new.pdf']);
  assert.equal(render().materials[0].file_path, 'old.pdf');
});

test('a successful replacement commits the new record before deleting the old file', async () => {
  const events = [];
  const render = learningContext({ material: {
    getMaterials: async () => [{ id: 'material', file_path: 'old.pdf' }],
    uploadMaterialFile: async () => { events.push('upload'); return 'new.pdf'; },
    getMaterialPublicUrl: path => path,
    updateMaterial: async () => { events.push('save'); return { id: 'material', file_path: 'new.pdf' }; },
    deleteMaterialFile: async path => events.push(`delete:${path}`),
  } });
  await render().getMaterials();
  await render().updateMaterial('material', {}, { name: 'new.pdf', type: 'application/pdf' });
  assert.equal(events.join(','), 'upload,save,delete:old.pdf');
  assert.equal(render().materials[0].file_path, 'new.pdf');
});

test('a failed material create cleans up the uploaded file', async () => {
  const deleted = [];
  const render = learningContext({ material: {
    uploadMaterialFile: async () => 'new.pdf', getMaterialPublicUrl: path => path,
    createMaterial: async () => { throw new Error('save failed'); },
    deleteMaterialFile: async path => deleted.push(path),
  } });
  await assert.rejects(render().createMaterial({ title: 'test' }, { name: 'new.pdf' }), /save failed/);
  assert.deepEqual(deleted, ['new.pdf']);
});

for (const [method, stateKey, override] of [
  ['getTutorials', 'tutorials', 'tutorial'], ['getMaterials', 'materials', 'material'], ['getQuizSets', 'quizSets', 'quiz'],
]) {
  test(`${method} ignores an older language request that finishes last`, async () => {
    let resolveOld;
    let call = 0;
    const render = learningContext({ [override]: { [method]: () => ++call === 1 ? new Promise(resolve => { resolveOld = resolve; }) : Promise.resolve([{ id: 'new' }]) } });
    const old = render()[method]('ASL');
    await render()[method]('MSL');
    resolveOld([{ id: 'old' }]);
    await old;
    assert.equal(render()[stateKey][0].id, 'new');
  });
}
