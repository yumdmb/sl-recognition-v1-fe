-- Migration: Create daily_challenges table for rotating daily challenges
-- Rollback: DROP TABLE IF EXISTS public.daily_challenges;

-- Create daily_challenges table
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id SERIAL PRIMARY KEY,  -- Sequential ID for deterministic rotation
  language TEXT NOT NULL CHECK (language IN ('ASL', 'MSL')),
  challenge_text TEXT NOT NULL,
  hint TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

-- Everyone can view daily challenges (read-only for all authenticated users)
CREATE POLICY "Everyone can view daily challenges" ON public.daily_challenges
  FOR SELECT TO authenticated USING (true);

-- Admins can manage daily challenges
CREATE POLICY "Admins can manage daily challenges" ON public.daily_challenges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_challenges_language ON public.daily_challenges(language);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_is_active ON public.daily_challenges(is_active);

-- Add comment for documentation
COMMENT ON TABLE public.daily_challenges IS 'Pool of daily challenges that rotate based on date. Uses deterministic selection based on day-of-year modulo total challenges per language.';

-- Seed ASL Challenges
INSERT INTO public.daily_challenges (language, challenge_text, hint, difficulty) VALUES
  ('ASL', 'Sign "Hello"', 'Wave your hand with an open palm', 'easy'),
  ('ASL', 'Sign "Thank You"', 'Touch your chin and move hand forward', 'easy'),
  ('ASL', 'Sign "Good Morning"', 'Combine "good" and "morning" signs', 'easy'),
  ('ASL', 'Sign "How are you?"', 'Point to the person with a questioning expression', 'medium'),
  ('ASL', 'Sign "Nice to meet you"', 'Clasp hands together gently', 'medium'),
  ('ASL', 'Sign "My name is..."', 'Point to yourself then fingerspell', 'easy'),
  ('ASL', 'Sign "Please"', 'Rub your chest in a circular motion', 'easy'),
  ('ASL', 'Sign "Sorry"', 'Make a fist and rub it on your chest', 'easy'),
  ('ASL', 'Sign "Goodbye"', 'Wave your hand', 'easy'),
  ('ASL', 'Sign "I love you"', 'Extend thumb, index, and pinky finger', 'easy'),
  ('ASL', 'Sign "Yes"', 'Make a fist and nod it like a head nodding', 'easy'),
  ('ASL', 'Sign "No"', 'Snap your thumb, index, and middle finger together', 'easy'),
  ('ASL', 'Sign "Help"', 'Make a thumbs up on an open palm, lift up', 'medium'),
  ('ASL', 'Sign "Water"', 'Make W with 3 fingers and tap your chin', 'easy');

-- Seed MSL Challenges
INSERT INTO public.daily_challenges (language, challenge_text, hint, difficulty) VALUES
  ('MSL', 'Sign "Selamat Pagi" (Good Morning)', 'Combine greeting with morning gesture', 'easy'),
  ('MSL', 'Sign "Terima Kasih" (Thank You)', 'Similar to a respectful bow motion', 'easy'),
  ('MSL', 'Sign "Apa Khabar?" (How are you?)', 'Open palm questioning gesture', 'medium'),
  ('MSL', 'Sign "Hai" (Hello)', 'Simple wave greeting', 'easy'),
  ('MSL', 'Sign "Maaf" (Sorry)', 'Apologetic hand gesture on chest', 'easy'),
  ('MSL', 'Sign "Tolong" (Please/Help)', 'Requesting gesture with both hands', 'easy'),
  ('MSL', 'Sign "Saya" (I/Me)', 'Point to yourself', 'easy'),
  ('MSL', 'Sign "Nama saya..." (My name is...)', 'Point to self then gesture for name', 'medium'),
  ('MSL', 'Sign "Selamat Tinggal" (Goodbye)', 'Farewell waving gesture', 'easy'),
  ('MSL', 'Sign "Saya sayang awak" (I love you)', 'Heart gesture towards person', 'medium'),
  ('MSL', 'Sign "Ya" (Yes)', 'Nodding affirmation gesture', 'easy'),
  ('MSL', 'Sign "Tidak" (No)', 'Side-to-side denial gesture', 'easy'),
  ('MSL', 'Sign "Makan" (Eat)', 'Bring fingers to mouth', 'easy'),
  ('MSL', 'Sign "Minum" (Drink)', 'Drinking motion with hand', 'easy');
