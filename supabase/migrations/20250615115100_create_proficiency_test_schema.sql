-- Create the proficiency_levels enum
CREATE TYPE proficiency_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- Add proficiency_level to user_profiles table
-- Note: You might need to check if the user_profiles table exists in the public schema.
-- If you have a different user profile table, you will need to adjust this statement.
ALTER TABLE public.user_profiles
ADD COLUMN proficiency_level proficiency_level;

-- Create the proficiency_tests table
CREATE TABLE public.proficiency_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create the proficiency_test_questions table
CREATE TABLE public.proficiency_test_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES public.proficiency_tests(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    order_index INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create the proficiency_test_question_choices table
CREATE TABLE public.proficiency_test_question_choices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.proficiency_test_questions(id) ON DELETE CASCADE,
    choice_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create the proficiency_test_attempts table
CREATE TABLE public.proficiency_test_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    test_id UUID NOT NULL REFERENCES public.proficiency_tests(id) ON DELETE CASCADE,
    score INT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create the proficiency_test_attempt_answers table
CREATE TABLE public.proficiency_test_attempt_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.proficiency_test_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.proficiency_test_questions(id) ON DELETE CASCADE,
    choice_id UUID NOT NULL REFERENCES public.proficiency_test_question_choices(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies for the new tables
ALTER TABLE public.proficiency_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proficiency_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proficiency_test_question_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proficiency_test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proficiency_test_attempt_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.proficiency_tests FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.proficiency_test_questions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.proficiency_test_question_choices FOR SELECT USING (true);

CREATE POLICY "Users can view their own attempts" ON public.proficiency_test_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own attempts" ON public.proficiency_test_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own attempts" ON public.proficiency_test_attempts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own answers" ON public.proficiency_test_attempt_answers FOR SELECT USING (exists(select 1 from proficiency_test_attempts where proficiency_test_attempts.id = attempt_id and proficiency_test_attempts.user_id = auth.uid()));
CREATE POLICY "Users can create their own answers" ON public.proficiency_test_attempt_answers FOR INSERT WITH CHECK (exists(select 1 from proficiency_test_attempts where proficiency_test_attempts.id = attempt_id and proficiency_test_attempts.user_id = auth.uid()));