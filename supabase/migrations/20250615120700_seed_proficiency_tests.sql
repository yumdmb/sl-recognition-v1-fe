-- Clear existing proficiency test data to avoid duplicates
DELETE FROM public.proficiency_tests;

-- Seed data for Proficiency Tests

-- American Sign Language Test
WITH asl_test AS (
  INSERT INTO public.proficiency_tests (title, description)
  VALUES ('American Sign Language Proficiency Test', 'A test to assess your proficiency in American Sign Language.')
  RETURNING id
),
asl_q1 AS (
  INSERT INTO public.proficiency_test_questions (test_id, question_text, order_index)
  SELECT id, 'What is the handshape for the letter ''A'' in ASL?', 1 FROM asl_test
  RETURNING id
),
asl_q1_choices AS (
  INSERT INTO public.proficiency_test_question_choices (question_id, choice_text, is_correct)
  SELECT id, 'A closed fist with the thumb on the side.', true FROM asl_q1
  UNION ALL
  SELECT id, 'A flat hand.', false FROM asl_q1
  UNION ALL
  SELECT id, 'A fist with the thumb extended upwards.', false FROM asl_q1
  UNION ALL
  SELECT id, 'A fist with the index finger pointing up.', false FROM asl_q1
),
asl_q2 AS (
  INSERT INTO public.proficiency_test_questions (test_id, question_text, order_index)
  SELECT id, 'The sign for "I love you" in ASL combines the signs for which letters?', 2 FROM asl_test
  RETURNING id
),
asl_q2_choices AS (
  INSERT INTO public.proficiency_test_question_choices (question_id, choice_text, is_correct)
  SELECT id, 'I, L, Y', true FROM asl_q2
  UNION ALL
  SELECT id, 'I, L, U', false FROM asl_q2
  UNION ALL
  SELECT id, 'A, M, Y', false FROM asl_q2
  UNION ALL
  SELECT id, 'L, V, U', false FROM asl_q2
),
asl_q3 AS (
  INSERT INTO public.proficiency_test_questions (test_id, question_text, order_index)
  SELECT id, 'Facial expressions in ASL are primarily used for:', 3 FROM asl_test
  RETURNING id
),
asl_q3_choices AS (
  INSERT INTO public.proficiency_test_question_choices (question_id, choice_text, is_correct)
  SELECT id, 'Grammar and tone', true FROM asl_q3
  UNION ALL
  SELECT id, 'Showing emotion only', false FROM asl_q3
  UNION ALL
  SELECT id, 'Indicating a question only', false FROM asl_q3
  UNION ALL
  SELECT id, 'They are not important', false FROM asl_q3
),
asl_q4 AS (
  INSERT INTO public.proficiency_test_questions (test_id, question_text, order_index)
  SELECT id, 'Which of these is a common way to ask a "WH-" question (Who, What, Where, etc.) in ASL?', 4 FROM asl_test
  RETURNING id
),
asl_q4_choices AS (
  INSERT INTO public.proficiency_test_question_choices (question_id, choice_text, is_correct)
  SELECT id, 'Furrowed eyebrows and a slight head tilt.', true FROM asl_q4
  UNION ALL
  SELECT id, 'Raised eyebrows.', false FROM asl_q4
  UNION ALL
  SELECT id, 'A flat facial expression.', false FROM asl_q4
  UNION ALL
  SELECT id, 'Smiling widely.', false FROM asl_q4
),
asl_q5 AS (
  INSERT INTO public.proficiency_test_questions (test_id, question_text, order_index)
  SELECT id, 'The general sign for "time" in ASL involves tapping:', 5 FROM asl_test
  RETURNING id
)
INSERT INTO public.proficiency_test_question_choices (question_id, choice_text, is_correct)
SELECT id, 'The wrist', true FROM asl_q5
UNION ALL
SELECT id, 'The forehead', false FROM asl_q5
UNION ALL
SELECT id, 'The chin', false FROM asl_q5
UNION ALL
SELECT id, 'The shoulder', false FROM asl_q5;


-- Malaysian Sign Language Test
WITH bim_test AS (
  INSERT INTO public.proficiency_tests (title, description)
  VALUES ('Malaysian Sign Language Proficiency Test', 'A test to assess your proficiency in Malaysian Sign Language (Bahasa Isyarat Malaysia).')
  RETURNING id
),
bim_q1 AS (
  INSERT INTO public.proficiency_test_questions (test_id, question_text, order_index)
  SELECT id, 'What is the sign for "Terima Kasih" (Thank You) in BIM?', 1 FROM bim_test
  RETURNING id
),
bim_q1_choices AS (
  INSERT INTO public.proficiency_test_question_choices (question_id, choice_text, is_correct)
  SELECT id, 'Touching the chin with the fingertips of a flat hand and moving it forward.', true FROM bim_q1
  UNION ALL
  SELECT id, 'Tapping the chest twice.', false FROM bim_q1
  UNION ALL
  SELECT id, 'Waving a flat hand.', false FROM bim_q1
  UNION ALL
  SELECT id, 'Making a circular motion with the index finger on the cheek.', false FROM bim_q1
),
bim_q2 AS (
  INSERT INTO public.proficiency_test_questions (test_id, question_text, order_index)
  SELECT id, 'In BIM, the sign for "Saya" (I/Me) is typically made by:', 2 FROM bim_test
  RETURNING id
),
bim_q2_choices AS (
  INSERT INTO public.proficiency_test_question_choices (question_id, choice_text, is_correct)
  SELECT id, 'Pointing the index finger to the chest.', true FROM bim_q2
  UNION ALL
  SELECT id, 'Tapping the forehead.', false FROM bim_q2
  UNION ALL
  SELECT id, 'Placing a fist on the hip.', false FROM bim_q2
  UNION ALL
  SELECT id, 'Pointing the thumb to the chest.', false FROM bim_q2
),
bim_q3 AS (
  INSERT INTO public.proficiency_test_questions (test_id, question_text, order_index)
  SELECT id, 'BIM is a complete and natural language with its own:', 3 FROM bim_test
  RETURNING id
),
bim_q3_choices AS (
  INSERT INTO public.proficiency_test_question_choices (question_id, choice_text, is_correct)
  SELECT id, 'Grammar, syntax, and vocabulary', true FROM bim_q3
  UNION ALL
  SELECT id, 'Alphabet only', false FROM bim_q3
  UNION ALL
  SELECT id, 'Gestures borrowed from other languages', false FROM bim_q3
  UNION ALL
  SELECT id, 'Set of pictures', false FROM bim_q3
),
bim_q4 AS (
  INSERT INTO public.proficiency_test_questions (test_id, question_text, order_index)
  SELECT id, 'The sign for "Maaf" (Sorry) in BIM involves:', 4 FROM bim_test
  RETURNING id
),
bim_q4_choices AS (
  INSERT INTO public.proficiency_test_question_choices (question_id, choice_text, is_correct)
  SELECT id, 'A closed fist rubbing the chest in a circular motion.', true FROM bim_q4
  UNION ALL
  SELECT id, 'Tapping the chin.', false FROM bim_q4
  UNION ALL
  SELECT id, 'Waving both hands.', false FROM bim_q4
  UNION ALL
  SELECT id, 'Clapping hands once.', false FROM bim_q4
),
bim_q5 AS (
  INSERT INTO public.proficiency_test_questions (test_id, question_text, order_index)
  SELECT id, 'How do you sign "Di mana?" (Where?) in BIM?', 5 FROM bim_test
  RETURNING id
)
INSERT INTO public.proficiency_test_question_choices (question_id, choice_text, is_correct)
SELECT id, 'Shaking an index finger side-to-side with a questioning look.', true FROM bim_q5
UNION ALL
SELECT id, 'Pointing to the ground.', false FROM bim_q5
UNION ALL
SELECT id, 'Making a circle with both hands.', false FROM bim_q5
UNION ALL
SELECT id, 'Tapping the nose.', false FROM bim_q5;