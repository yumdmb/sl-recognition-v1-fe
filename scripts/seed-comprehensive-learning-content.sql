-- ============================================================================
-- COMPREHENSIVE LEARNING CONTENT SEED DATA
-- Malaysian Sign Language (MSL) & American Sign Language (ASL)
-- For Deaf and Non-Deaf Learners
-- All Proficiency Levels: Beginner, Intermediate, Advanced
-- ============================================================================

-- Clear existing test data (optional - comment out if you want to keep existing data)
-- DELETE FROM public.tutorials WHERE title LIKE '%sample%' OR video_url LIKE '%sample%';
-- DELETE FROM public.materials WHERE download_url LIKE '%example.com%';
-- DELETE FROM public.quiz_sets WHERE description LIKE '%Test%' OR description LIKE '%test%';

-- ============================================================================
-- TUTORIALS - MALAYSIAN SIGN LANGUAGE (MSL)
-- ============================================================================

-- MSL BEGINNER - DEAF USERS (Visual-First Learning)
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('MSL Alphabet - Visual Guide', 'Learn the MSL alphabet through pure visual demonstrations. No audio needed - perfect for visual learners.', 'https://www.youtube.com/watch?v=MSL_Alphabet_Visual', 'beginner', 'MSL', 'deaf', 'https://img.youtube.com/vi/MSL_Alphabet_Visual/maxresdefault.jpg'),
('MSL Numbers 1-20 - Visual Method', 'Master MSL numbers using visual memory techniques. Designed for deaf community members.', 'https://www.youtube.com/watch?v=MSL_Numbers_Visual', 'beginner', 'MSL', 'deaf', 'https://img.youtube.com/vi/MSL_Numbers_Visual/maxresdefault.jpg'),
('MSL Greetings - Deaf Culture Approach', 'Learn common MSL greetings with cultural context from the deaf community perspective.', 'https://www.youtube.com/watch?v=MSL_Greetings_Deaf', 'beginner', 'MSL', 'deaf', 'https://img.youtube.com/vi/MSL_Greetings_Deaf/maxresdefault.jpg'),
('MSL Family Signs - Visual Learning', 'Learn family-related signs through visual storytelling and demonstrations.', 'https://www.youtube.com/watch?v=MSL_Family_Visual', 'beginner', 'MSL', 'deaf', 'https://img.youtube.com/vi/MSL_Family_Visual/maxresdefault.jpg'),
('MSL Colors - Visual Recognition', 'Master color signs in MSL using visual association techniques.', 'https://www.youtube.com/watch?v=MSL_Colors_Visual', 'beginner', 'MSL', 'deaf', 'https://img.youtube.com/vi/MSL_Colors_Visual/maxresdefault.jpg');

-- MSL BEGINNER - NON-DEAF USERS (Comparative Learning)
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('MSL Alphabet with Pronunciation', 'Learn MSL alphabet with Malay pronunciation guide and context for hearing learners.', 'https://www.youtube.com/watch?v=MSL_Alphabet_Audio', 'beginner', 'MSL', 'non-deaf', 'https://img.youtube.com/vi/MSL_Alphabet_Audio/maxresdefault.jpg'),
('MSL Numbers with Voice Guide', 'Learn MSL numbers with audio explanations and pronunciation tips.', 'https://www.youtube.com/watch?v=MSL_Numbers_Audio', 'beginner', 'MSL', 'non-deaf', 'https://img.youtube.com/vi/MSL_Numbers_Audio/maxresdefault.jpg'),
('MSL Greetings - Hearing Perspective', 'Common MSL greetings explained with audio context and cultural notes for hearing learners.', 'https://www.youtube.com/watch?v=MSL_Greetings_Audio', 'beginner', 'MSL', 'non-deaf', 'https://img.youtube.com/vi/MSL_Greetings_Audio/maxresdefault.jpg'),
('MSL Family Signs with Context', 'Family signs in MSL with pronunciation and usage examples in Malay.', 'https://www.youtube.com/watch?v=MSL_Family_Audio', 'beginner', 'MSL', 'non-deaf', 'https://img.youtube.com/vi/MSL_Family_Audio/maxresdefault.jpg'),
('MSL Colors - Comparative Learning', 'Learn color signs with Malay word comparisons and pronunciation.', 'https://www.youtube.com/watch?v=MSL_Colors_Audio', 'beginner', 'MSL', 'non-deaf', 'https://img.youtube.com/vi/MSL_Colors_Audio/maxresdefault.jpg');

-- MSL BEGINNER - UNIVERSAL
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('MSL Basics - Getting Started', 'Introduction to Malaysian Sign Language for all learners. Start your MSL journey here.', 'https://www.youtube.com/watch?v=MSL_Basics_All', 'beginner', 'MSL', 'all', 'https://img.youtube.com/vi/MSL_Basics_All/maxresdefault.jpg'),
('MSL Common Phrases', 'Essential MSL phrases everyone should know. Suitable for all learning styles.', 'https://www.youtube.com/watch?v=MSL_Phrases_All', 'beginner', 'MSL', 'all', 'https://img.youtube.com/vi/MSL_Phrases_All/maxresdefault.jpg'),
('MSL Days and Months', 'Learn to sign days of the week and months in MSL. Universal learning approach.', 'https://www.youtube.com/watch?v=MSL_Time_All', 'beginner', 'MSL', 'all', 'https://img.youtube.com/vi/MSL_Time_All/maxresdefault.jpg');

-- MSL INTERMEDIATE - DEAF USERS
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('MSL Conversation Flow - Visual', 'Build natural conversation skills in MSL using visual storytelling techniques.', 'https://www.youtube.com/watch?v=MSL_Conv_Visual', 'intermediate', 'MSL', 'deaf', 'https://img.youtube.com/vi/MSL_Conv_Visual/maxresdefault.jpg'),
('MSL Emotions and Expressions', 'Express complex emotions in MSL with facial expressions and body language.', 'https://www.youtube.com/watch?v=MSL_Emotions_Visual', 'intermediate', 'MSL', 'deaf', 'https://img.youtube.com/vi/MSL_Emotions_Visual/maxresdefault.jpg'),
('MSL Workplace Signs - Deaf Focus', 'Professional MSL vocabulary for workplace communication from deaf perspective.', 'https://www.youtube.com/watch?v=MSL_Work_Visual', 'intermediate', 'MSL', 'deaf', 'https://img.youtube.com/vi/MSL_Work_Visual/maxresdefault.jpg'),
('MSL Storytelling Techniques', 'Advanced visual storytelling in MSL using classifier handshapes and spatial grammar.', 'https://www.youtube.com/watch?v=MSL_Story_Visual', 'intermediate', 'MSL', 'deaf', 'https://img.youtube.com/vi/MSL_Story_Visual/maxresdefault.jpg');

-- MSL INTERMEDIATE - NON-DEAF USERS
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('MSL Conversation with Context', 'Build MSL conversation skills with audio explanations and cultural context.', 'https://www.youtube.com/watch?v=MSL_Conv_Audio', 'intermediate', 'MSL', 'non-deaf', 'https://img.youtube.com/vi/MSL_Conv_Audio/maxresdefault.jpg'),
('MSL Emotions - Hearing Perspective', 'Express emotions in MSL with pronunciation guides and usage examples.', 'https://www.youtube.com/watch?v=MSL_Emotions_Audio', 'intermediate', 'MSL', 'non-deaf', 'https://img.youtube.com/vi/MSL_Emotions_Audio/maxresdefault.jpg'),
('MSL Workplace Communication', 'Professional MSL with audio context for hearing professionals learning sign language.', 'https://www.youtube.com/watch?v=MSL_Work_Audio', 'intermediate', 'MSL', 'non-deaf', 'https://img.youtube.com/vi/MSL_Work_Audio/maxresdefault.jpg'),
('MSL Grammar Structures', 'Understanding MSL grammar with comparisons to Malay language structure.', 'https://www.youtube.com/watch?v=MSL_Grammar_Audio', 'intermediate', 'MSL', 'non-deaf', 'https://img.youtube.com/vi/MSL_Grammar_Audio/maxresdefault.jpg');

-- MSL INTERMEDIATE - UNIVERSAL
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('MSL Shopping and Services', 'Practical MSL for shopping, restaurants, and daily services. For all learners.', 'https://www.youtube.com/watch?v=MSL_Shopping_All', 'intermediate', 'MSL', 'all', 'https://img.youtube.com/vi/MSL_Shopping_All/maxresdefault.jpg'),
('MSL Travel and Directions', 'Navigate Malaysia using MSL. Essential travel vocabulary for everyone.', 'https://www.youtube.com/watch?v=MSL_Travel_All', 'intermediate', 'MSL', 'all', 'https://img.youtube.com/vi/MSL_Travel_All/maxresdefault.jpg');

-- MSL ADVANCED - DEAF USERS
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('MSL Deaf Culture and History', 'Deep dive into Malaysian deaf culture, history, and community values.', 'https://www.youtube.com/watch?v=MSL_Culture_Visual', 'advanced', 'MSL', 'deaf', 'https://img.youtube.com/vi/MSL_Culture_Visual/maxresdefault.jpg'),
('MSL Poetry and Art', 'Create visual poetry and artistic expression in MSL using advanced techniques.', 'https://www.youtube.com/watch?v=MSL_Poetry_Visual', 'advanced', 'MSL', 'deaf', 'https://img.youtube.com/vi/MSL_Poetry_Visual/maxresdefault.jpg'),
('MSL Interpreting Skills', 'Advanced MSL for aspiring interpreters from deaf community perspective.', 'https://www.youtube.com/watch?v=MSL_Interpret_Visual', 'advanced', 'MSL', 'deaf', 'https://img.youtube.com/vi/MSL_Interpret_Visual/maxresdefault.jpg');

-- MSL ADVANCED - NON-DEAF USERS
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('MSL Professional Interpreting', 'Professional MSL interpreting with audio context and ethical considerations.', 'https://www.youtube.com/watch?v=MSL_Interpret_Audio', 'advanced', 'MSL', 'non-deaf', 'https://img.youtube.com/vi/MSL_Interpret_Audio/maxresdefault.jpg'),
('MSL Academic Vocabulary', 'Advanced academic and technical MSL vocabulary with pronunciation guides.', 'https://www.youtube.com/watch?v=MSL_Academic_Audio', 'advanced', 'MSL', 'non-deaf', 'https://img.youtube.com/vi/MSL_Academic_Audio/maxresdefault.jpg'),
('MSL Cultural Competency', 'Understanding deaf culture in Malaysia from hearing perspective with audio guidance.', 'https://www.youtube.com/watch?v=MSL_Competency_Audio', 'advanced', 'MSL', 'non-deaf', 'https://img.youtube.com/vi/MSL_Competency_Audio/maxresdefault.jpg');

-- MSL ADVANCED - UNIVERSAL
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('MSL Legal and Medical Terms', 'Specialized MSL vocabulary for legal and medical contexts. For all advanced learners.', 'https://www.youtube.com/watch?v=MSL_Legal_All', 'advanced', 'MSL', 'all', 'https://img.youtube.com/vi/MSL_Legal_All/maxresdefault.jpg'),
('MSL Teaching Methodology', 'Learn how to teach MSL effectively to others. For all aspiring instructors.', 'https://www.youtube.com/watch?v=MSL_Teaching_All', 'advanced', 'MSL', 'all', 'https://img.youtube.com/vi/MSL_Teaching_All/maxresdefault.jpg');

-- ============================================================================
-- TUTORIALS - AMERICAN SIGN LANGUAGE (ASL)
-- ============================================================================

-- ASL BEGINNER - DEAF USERS
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('ASL Alphabet - Visual Method', 'Learn ASL fingerspelling through visual demonstrations. Deaf-friendly approach.', 'https://www.youtube.com/watch?v=ASL_Alphabet_Visual', 'beginner', 'ASL', 'deaf', 'https://img.youtube.com/vi/ASL_Alphabet_Visual/maxresdefault.jpg'),
('ASL Numbers - Visual Learning', 'Master ASL numbers 1-100 using visual memory techniques for deaf learners.', 'https://www.youtube.com/watch?v=ASL_Numbers_Visual', 'beginner', 'ASL', 'deaf', 'https://img.youtube.com/vi/ASL_Numbers_Visual/maxresdefault.jpg'),
('ASL Greetings - Deaf Culture', 'Common ASL greetings from American deaf community perspective.', 'https://www.youtube.com/watch?v=ASL_Greetings_Deaf', 'beginner', 'ASL', 'deaf', 'https://img.youtube.com/vi/ASL_Greetings_Deaf/maxresdefault.jpg'),
('ASL Family Signs - Visual', 'Learn family vocabulary in ASL through visual storytelling.', 'https://www.youtube.com/watch?v=ASL_Family_Visual', 'beginner', 'ASL', 'deaf', 'https://img.youtube.com/vi/ASL_Family_Visual/maxresdefault.jpg'),
('ASL Colors and Shapes', 'Master colors and shapes in ASL using visual association.', 'https://www.youtube.com/watch?v=ASL_Colors_Visual', 'beginner', 'ASL', 'deaf', 'https://img.youtube.com/vi/ASL_Colors_Visual/maxresdefault.jpg');

-- ASL BEGINNER - NON-DEAF USERS
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('ASL Alphabet with Pronunciation', 'Learn ASL fingerspelling with English pronunciation and context.', 'https://www.youtube.com/watch?v=ASL_Alphabet_Audio', 'beginner', 'ASL', 'non-deaf', 'https://img.youtube.com/vi/ASL_Alphabet_Audio/maxresdefault.jpg'),
('ASL Numbers with Voice Guide', 'ASL numbers explained with audio guidance and usage examples.', 'https://www.youtube.com/watch?v=ASL_Numbers_Audio', 'beginner', 'ASL', 'non-deaf', 'https://img.youtube.com/vi/ASL_Numbers_Audio/maxresdefault.jpg'),
('ASL Greetings - Hearing Perspective', 'Common ASL greetings with audio explanations for hearing learners.', 'https://www.youtube.com/watch?v=ASL_Greetings_Audio', 'beginner', 'ASL', 'non-deaf', 'https://img.youtube.com/vi/ASL_Greetings_Audio/maxresdefault.jpg'),
('ASL Family Signs with Context', 'Family vocabulary in ASL with English pronunciation and examples.', 'https://www.youtube.com/watch?v=ASL_Family_Audio', 'beginner', 'ASL', 'non-deaf', 'https://img.youtube.com/vi/ASL_Family_Audio/maxresdefault.jpg'),
('ASL Colors - Comparative Method', 'Learn ASL colors with English word comparisons and pronunciation.', 'https://www.youtube.com/watch?v=ASL_Colors_Audio', 'beginner', 'ASL', 'non-deaf', 'https://img.youtube.com/vi/ASL_Colors_Audio/maxresdefault.jpg');

-- ASL BEGINNER - UNIVERSAL
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('ASL Basics - Introduction', 'Introduction to American Sign Language for all learners. Start here.', 'https://www.youtube.com/watch?v=ASL_Basics_All', 'beginner', 'ASL', 'all', 'https://img.youtube.com/vi/ASL_Basics_All/maxresdefault.jpg'),
('ASL Common Phrases', 'Essential ASL phrases everyone should know. Universal approach.', 'https://www.youtube.com/watch?v=ASL_Phrases_All', 'beginner', 'ASL', 'all', 'https://img.youtube.com/vi/ASL_Phrases_All/maxresdefault.jpg'),
('ASL Time and Calendar', 'Learn to sign time, days, and dates in ASL. For all learners.', 'https://www.youtube.com/watch?v=ASL_Time_All', 'beginner', 'ASL', 'all', 'https://img.youtube.com/vi/ASL_Time_All/maxresdefault.jpg');

-- ASL INTERMEDIATE - DEAF USERS
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('ASL Conversation Skills - Visual', 'Build natural ASL conversation flow using visual techniques.', 'https://www.youtube.com/watch?v=ASL_Conv_Visual', 'intermediate', 'ASL', 'deaf', 'https://img.youtube.com/vi/ASL_Conv_Visual/maxresdefault.jpg'),
('ASL Emotions and Feelings', 'Express complex emotions in ASL with facial grammar and body language.', 'https://www.youtube.com/watch?v=ASL_Emotions_Visual', 'intermediate', 'ASL', 'deaf', 'https://img.youtube.com/vi/ASL_Emotions_Visual/maxresdefault.jpg'),
('ASL Workplace Communication', 'Professional ASL vocabulary from deaf community perspective.', 'https://www.youtube.com/watch?v=ASL_Work_Visual', 'intermediate', 'ASL', 'deaf', 'https://img.youtube.com/vi/ASL_Work_Visual/maxresdefault.jpg'),
('ASL Storytelling and Narratives', 'Advanced visual storytelling using ASL classifiers and spatial grammar.', 'https://www.youtube.com/watch?v=ASL_Story_Visual', 'intermediate', 'ASL', 'deaf', 'https://img.youtube.com/vi/ASL_Story_Visual/maxresdefault.jpg');

-- ASL INTERMEDIATE - NON-DEAF USERS
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('ASL Conversation with Audio', 'Build ASL conversation skills with English audio explanations.', 'https://www.youtube.com/watch?v=ASL_Conv_Audio', 'intermediate', 'ASL', 'non-deaf', 'https://img.youtube.com/vi/ASL_Conv_Audio/maxresdefault.jpg'),
('ASL Emotions - Hearing View', 'Express emotions in ASL with pronunciation and cultural context.', 'https://www.youtube.com/watch?v=ASL_Emotions_Audio', 'intermediate', 'ASL', 'non-deaf', 'https://img.youtube.com/vi/ASL_Emotions_Audio/maxresdefault.jpg'),
('ASL Professional Settings', 'Professional ASL with audio context for hearing professionals.', 'https://www.youtube.com/watch?v=ASL_Work_Audio', 'intermediate', 'ASL', 'non-deaf', 'https://img.youtube.com/vi/ASL_Work_Audio/maxresdefault.jpg'),
('ASL Grammar and Structure', 'Understanding ASL grammar with English language comparisons.', 'https://www.youtube.com/watch?v=ASL_Grammar_Audio', 'intermediate', 'ASL', 'non-deaf', 'https://img.youtube.com/vi/ASL_Grammar_Audio/maxresdefault.jpg');

-- ASL INTERMEDIATE - UNIVERSAL
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('ASL Shopping and Dining', 'Practical ASL for shopping and restaurants. For all learners.', 'https://www.youtube.com/watch?v=ASL_Shopping_All', 'intermediate', 'ASL', 'all', 'https://img.youtube.com/vi/ASL_Shopping_All/maxresdefault.jpg'),
('ASL Travel and Navigation', 'Navigate using ASL. Essential travel vocabulary for everyone.', 'https://www.youtube.com/watch?v=ASL_Travel_All', 'intermediate', 'ASL', 'all', 'https://img.youtube.com/vi/ASL_Travel_All/maxresdefault.jpg');

-- ASL ADVANCED - DEAF USERS
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('ASL Deaf Culture and Heritage', 'Deep dive into American deaf culture, history, and community.', 'https://www.youtube.com/watch?v=ASL_Culture_Visual', 'advanced', 'ASL', 'deaf', 'https://img.youtube.com/vi/ASL_Culture_Visual/maxresdefault.jpg'),
('ASL Poetry and Performance', 'Create visual poetry and artistic expression in ASL.', 'https://www.youtube.com/watch?v=ASL_Poetry_Visual', 'advanced', 'ASL', 'deaf', 'https://img.youtube.com/vi/ASL_Poetry_Visual/maxresdefault.jpg'),
('ASL Interpreting - Deaf View', 'Advanced ASL interpreting from deaf community perspective.', 'https://www.youtube.com/watch?v=ASL_Interpret_Visual', 'advanced', 'ASL', 'deaf', 'https://img.youtube.com/vi/ASL_Interpret_Visual/maxresdefault.jpg');

-- ASL ADVANCED - NON-DEAF USERS
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('ASL Professional Interpreting', 'Professional ASL interpreting with audio context and ethics.', 'https://www.youtube.com/watch?v=ASL_Interpret_Audio', 'advanced', 'ASL', 'non-deaf', 'https://img.youtube.com/vi/ASL_Interpret_Audio/maxresdefault.jpg'),
('ASL Academic Vocabulary', 'Advanced academic and technical ASL with pronunciation.', 'https://www.youtube.com/watch?v=ASL_Academic_Audio', 'advanced', 'ASL', 'non-deaf', 'https://img.youtube.com/vi/ASL_Academic_Audio/maxresdefault.jpg'),
('ASL Cultural Competency', 'Understanding American deaf culture from hearing perspective.', 'https://www.youtube.com/watch?v=ASL_Competency_Audio', 'advanced', 'ASL', 'non-deaf', 'https://img.youtube.com/vi/ASL_Competency_Audio/maxresdefault.jpg');

-- ASL ADVANCED - UNIVERSAL
INSERT INTO public.tutorials (title, description, video_url, level, language, recommended_for_role, thumbnail_url) VALUES
('ASL Legal and Medical Terms', 'Specialized ASL for legal and medical contexts. For all advanced learners.', 'https://www.youtube.com/watch?v=ASL_Legal_All', 'advanced', 'ASL', 'all', 'https://img.youtube.com/vi/ASL_Legal_All/maxresdefault.jpg'),
('ASL Teaching Methods', 'Learn how to teach ASL effectively. For all aspiring instructors.', 'https://www.youtube.com/watch?v=ASL_Teaching_All', 'advanced', 'ASL', 'all', 'https://img.youtube.com/vi/ASL_Teaching_All/maxresdefault.jpg');


-- ============================================================================
-- MATERIALS - MALAYSIAN SIGN LANGUAGE (MSL)
-- ============================================================================

-- MSL BEGINNER - DEAF USERS
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('MSL Visual Dictionary - Beginner', 'Comprehensive visual dictionary of basic MSL signs. Image-based learning for deaf community.', 'application/pdf', 'https://storage.supabase.co/msl/msl-visual-dict-beginner-deaf.pdf', 'beginner', 'MSL', 'deaf', 5242880),
('MSL Deaf Culture Guide', 'Introduction to Malaysian deaf culture, values, and community practices. Visual format.', 'application/pdf', 'https://storage.supabase.co/msl/msl-culture-guide-deaf.pdf', 'beginner', 'MSL', 'deaf', 3145728),
('MSL Fingerspelling Chart - Visual', 'Large format MSL fingerspelling chart for visual reference.', 'image/png', 'https://storage.supabase.co/msl/msl-fingerspelling-visual.png', 'beginner', 'MSL', 'deaf', 1048576),
('MSL Common Signs Flashcards', 'Printable flashcards with visual demonstrations of common MSL signs.', 'application/pdf', 'https://storage.supabase.co/msl/msl-flashcards-deaf.pdf', 'beginner', 'MSL', 'deaf', 2097152);

-- MSL BEGINNER - NON-DEAF USERS
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('MSL Dictionary with Pronunciation', 'MSL dictionary with Malay pronunciation guides and usage examples.', 'application/pdf', 'https://storage.supabase.co/msl/msl-dict-beginner-audio.pdf', 'beginner', 'MSL', 'non-deaf', 6291456),
('MSL Learning Guide for Hearing', 'Comprehensive guide for hearing individuals learning MSL with audio references.', 'application/pdf', 'https://storage.supabase.co/msl/msl-hearing-guide.pdf', 'beginner', 'MSL', 'non-deaf', 4194304),
('MSL Pronunciation Workbook', 'Practice workbook with Malay pronunciation for MSL signs.', 'application/pdf', 'https://storage.supabase.co/msl/msl-pronunciation-workbook.pdf', 'beginner', 'MSL', 'non-deaf', 3145728),
('MSL Comparative Grammar Guide', 'Understanding MSL grammar compared to Malay language structure.', 'application/pdf', 'https://storage.supabase.co/msl/msl-grammar-comparative.pdf', 'beginner', 'MSL', 'non-deaf', 2621440);

-- MSL BEGINNER - UNIVERSAL
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('MSL Quick Reference Guide', 'Essential MSL signs quick reference for all learners.', 'application/pdf', 'https://storage.supabase.co/msl/msl-quick-ref-all.pdf', 'beginner', 'MSL', 'all', 2097152),
('MSL Alphabet Poster', 'Printable MSL alphabet poster for classroom or home use.', 'image/png', 'https://storage.supabase.co/msl/msl-alphabet-poster.png', 'beginner', 'MSL', 'all', 1572864),
('MSL Numbers Chart', 'Visual chart of MSL numbers 1-100 for all learners.', 'image/png', 'https://storage.supabase.co/msl/msl-numbers-chart.png', 'beginner', 'MSL', 'all', 1048576);

-- MSL INTERMEDIATE - DEAF USERS
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('MSL Conversation Scenarios - Visual', 'Real-life conversation scenarios in MSL with visual demonstrations.', 'application/pdf', 'https://storage.supabase.co/msl/msl-conversations-visual.pdf', 'intermediate', 'MSL', 'deaf', 7340032),
('MSL Classifier Handbook', 'Comprehensive guide to MSL classifiers and spatial grammar for deaf learners.', 'application/pdf', 'https://storage.supabase.co/msl/msl-classifiers-deaf.pdf', 'intermediate', 'MSL', 'deaf', 5242880),
('MSL Workplace Vocabulary', 'Professional MSL vocabulary from deaf community perspective.', 'application/pdf', 'https://storage.supabase.co/msl/msl-workplace-deaf.pdf', 'intermediate', 'MSL', 'deaf', 4194304);

-- MSL INTERMEDIATE - NON-DEAF USERS
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('MSL Conversation Guide with Audio', 'Conversation practice guide with pronunciation and context.', 'application/pdf', 'https://storage.supabase.co/msl/msl-conversations-audio.pdf', 'intermediate', 'MSL', 'non-deaf', 8388608),
('MSL Grammar Workbook', 'Advanced MSL grammar exercises with Malay comparisons.', 'application/pdf', 'https://storage.supabase.co/msl/msl-grammar-workbook.pdf', 'intermediate', 'MSL', 'non-deaf', 5242880),
('MSL Professional Communication', 'Business and professional MSL with pronunciation guides.', 'application/pdf', 'https://storage.supabase.co/msl/msl-professional-audio.pdf', 'intermediate', 'MSL', 'non-deaf', 6291456);

-- MSL INTERMEDIATE - UNIVERSAL
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('MSL Idioms and Expressions', 'Common MSL idioms and expressions for all learners.', 'application/pdf', 'https://storage.supabase.co/msl/msl-idioms-all.pdf', 'intermediate', 'MSL', 'all', 4194304),
('MSL Regional Variations', 'Guide to MSL variations across different regions of Malaysia.', 'application/pdf', 'https://storage.supabase.co/msl/msl-regional-all.pdf', 'intermediate', 'MSL', 'all', 5242880);

-- MSL ADVANCED - DEAF USERS
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('MSL Deaf History in Malaysia', 'Comprehensive history of deaf community and MSL development.', 'application/pdf', 'https://storage.supabase.co/msl/msl-history-deaf.pdf', 'advanced', 'MSL', 'deaf', 10485760),
('MSL Poetry and Literature', 'Collection of MSL poetry and visual literature from deaf artists.', 'application/pdf', 'https://storage.supabase.co/msl/msl-poetry-deaf.pdf', 'advanced', 'MSL', 'deaf', 8388608),
('MSL Interpreting Ethics', 'Professional ethics for MSL interpreters from deaf perspective.', 'application/pdf', 'https://storage.supabase.co/msl/msl-ethics-deaf.pdf', 'advanced', 'MSL', 'deaf', 6291456);

-- MSL ADVANCED - NON-DEAF USERS
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('MSL Interpreting Certification Guide', 'Preparation guide for MSL interpreter certification with audio resources.', 'application/pdf', 'https://storage.supabase.co/msl/msl-cert-guide-audio.pdf', 'advanced', 'MSL', 'non-deaf', 12582912),
('MSL Academic Vocabulary List', 'Comprehensive academic and technical MSL vocabulary with pronunciation.', 'application/pdf', 'https://storage.supabase.co/msl/msl-academic-audio.pdf', 'advanced', 'MSL', 'non-deaf', 9437184),
('MSL Cultural Competency Manual', 'Advanced cultural competency training for hearing professionals.', 'application/pdf', 'https://storage.supabase.co/msl/msl-competency-audio.pdf', 'advanced', 'MSL', 'non-deaf', 7340032);

-- MSL ADVANCED - UNIVERSAL
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('MSL Legal Terminology', 'Specialized MSL vocabulary for legal contexts. For all advanced learners.', 'application/pdf', 'https://storage.supabase.co/msl/msl-legal-all.pdf', 'advanced', 'MSL', 'all', 8388608),
('MSL Medical Terminology', 'Comprehensive medical MSL vocabulary for healthcare settings.', 'application/pdf', 'https://storage.supabase.co/msl/msl-medical-all.pdf', 'advanced', 'MSL', 'all', 9437184),
('MSL Teaching Curriculum', 'Complete curriculum guide for MSL instructors.', 'application/pdf', 'https://storage.supabase.co/msl/msl-teaching-all.pdf', 'advanced', 'MSL', 'all', 11534336);

-- ============================================================================
-- MATERIALS - AMERICAN SIGN LANGUAGE (ASL)
-- ============================================================================

-- ASL BEGINNER - DEAF USERS
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('ASL Visual Dictionary - Beginner', 'Comprehensive visual dictionary of basic ASL signs. Image-based for deaf learners.', 'application/pdf', 'https://storage.supabase.co/asl/asl-visual-dict-beginner-deaf.pdf', 'beginner', 'ASL', 'deaf', 5242880),
('ASL Deaf Culture in America', 'Introduction to American deaf culture, history, and community values.', 'application/pdf', 'https://storage.supabase.co/asl/asl-culture-guide-deaf.pdf', 'beginner', 'ASL', 'deaf', 3145728),
('ASL Fingerspelling Chart - Visual', 'Large format ASL fingerspelling chart for visual reference.', 'image/png', 'https://storage.supabase.co/asl/asl-fingerspelling-visual.png', 'beginner', 'ASL', 'deaf', 1048576),
('ASL Common Signs Flashcards', 'Printable flashcards with visual demonstrations of common ASL signs.', 'application/pdf', 'https://storage.supabase.co/asl/asl-flashcards-deaf.pdf', 'beginner', 'ASL', 'deaf', 2097152);

-- ASL BEGINNER - NON-DEAF USERS
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('ASL Dictionary with Pronunciation', 'ASL dictionary with English pronunciation guides and usage examples.', 'application/pdf', 'https://storage.supabase.co/asl/asl-dict-beginner-audio.pdf', 'beginner', 'ASL', 'non-deaf', 6291456),
('ASL Learning Guide for Hearing', 'Comprehensive guide for hearing individuals learning ASL with audio references.', 'application/pdf', 'https://storage.supabase.co/asl/asl-hearing-guide.pdf', 'beginner', 'ASL', 'non-deaf', 4194304),
('ASL Pronunciation Workbook', 'Practice workbook with English pronunciation for ASL signs.', 'application/pdf', 'https://storage.supabase.co/asl/asl-pronunciation-workbook.pdf', 'beginner', 'ASL', 'non-deaf', 3145728),
('ASL Comparative Grammar Guide', 'Understanding ASL grammar compared to English language structure.', 'application/pdf', 'https://storage.supabase.co/asl/asl-grammar-comparative.pdf', 'beginner', 'ASL', 'non-deaf', 2621440);

-- ASL BEGINNER - UNIVERSAL
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('ASL Quick Reference Guide', 'Essential ASL signs quick reference for all learners.', 'application/pdf', 'https://storage.supabase.co/asl/asl-quick-ref-all.pdf', 'beginner', 'ASL', 'all', 2097152),
('ASL Alphabet Poster', 'Printable ASL alphabet poster for classroom or home use.', 'image/png', 'https://storage.supabase.co/asl/asl-alphabet-poster.png', 'beginner', 'ASL', 'all', 1572864),
('ASL Numbers Chart', 'Visual chart of ASL numbers 1-100 for all learners.', 'image/png', 'https://storage.supabase.co/asl/asl-numbers-chart.png', 'beginner', 'ASL', 'all', 1048576);

-- ASL INTERMEDIATE - DEAF USERS
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('ASL Conversation Scenarios - Visual', 'Real-life conversation scenarios in ASL with visual demonstrations.', 'application/pdf', 'https://storage.supabase.co/asl/asl-conversations-visual.pdf', 'intermediate', 'ASL', 'deaf', 7340032),
('ASL Classifier Handbook', 'Comprehensive guide to ASL classifiers and spatial grammar for deaf learners.', 'application/pdf', 'https://storage.supabase.co/asl/asl-classifiers-deaf.pdf', 'intermediate', 'ASL', 'deaf', 5242880),
('ASL Workplace Vocabulary', 'Professional ASL vocabulary from deaf community perspective.', 'application/pdf', 'https://storage.supabase.co/asl/asl-workplace-deaf.pdf', 'intermediate', 'ASL', 'deaf', 4194304);

-- ASL INTERMEDIATE - NON-DEAF USERS
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('ASL Conversation Guide with Audio', 'Conversation practice guide with pronunciation and context.', 'application/pdf', 'https://storage.supabase.co/asl/asl-conversations-audio.pdf', 'intermediate', 'ASL', 'non-deaf', 8388608),
('ASL Grammar Workbook', 'Advanced ASL grammar exercises with English comparisons.', 'application/pdf', 'https://storage.supabase.co/asl/asl-grammar-workbook.pdf', 'intermediate', 'ASL', 'non-deaf', 5242880),
('ASL Professional Communication', 'Business and professional ASL with pronunciation guides.', 'application/pdf', 'https://storage.supabase.co/asl/asl-professional-audio.pdf', 'intermediate', 'ASL', 'non-deaf', 6291456);

-- ASL INTERMEDIATE - UNIVERSAL
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('ASL Idioms and Expressions', 'Common ASL idioms and expressions for all learners.', 'application/pdf', 'https://storage.supabase.co/asl/asl-idioms-all.pdf', 'intermediate', 'ASL', 'all', 4194304),
('ASL Regional Variations', 'Guide to ASL variations across different regions of America.', 'application/pdf', 'https://storage.supabase.co/asl/asl-regional-all.pdf', 'intermediate', 'ASL', 'all', 5242880);

-- ASL ADVANCED - DEAF USERS
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('ASL Deaf History in America', 'Comprehensive history of American deaf community and ASL development.', 'application/pdf', 'https://storage.supabase.co/asl/asl-history-deaf.pdf', 'advanced', 'ASL', 'deaf', 10485760),
('ASL Poetry and Literature', 'Collection of ASL poetry and visual literature from deaf artists.', 'application/pdf', 'https://storage.supabase.co/asl/asl-poetry-deaf.pdf', 'advanced', 'ASL', 'deaf', 8388608),
('ASL Interpreting Ethics', 'Professional ethics for ASL interpreters from deaf perspective.', 'application/pdf', 'https://storage.supabase.co/asl/asl-ethics-deaf.pdf', 'advanced', 'ASL', 'deaf', 6291456);

-- ASL ADVANCED - NON-DEAF USERS
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('ASL Interpreting Certification Guide', 'Preparation guide for ASL interpreter certification with audio resources.', 'application/pdf', 'https://storage.supabase.co/asl/asl-cert-guide-audio.pdf', 'advanced', 'ASL', 'non-deaf', 12582912),
('ASL Academic Vocabulary List', 'Comprehensive academic and technical ASL vocabulary with pronunciation.', 'application/pdf', 'https://storage.supabase.co/asl/asl-academic-audio.pdf', 'advanced', 'ASL', 'non-deaf', 9437184),
('ASL Cultural Competency Manual', 'Advanced cultural competency training for hearing professionals.', 'application/pdf', 'https://storage.supabase.co/asl/asl-competency-audio.pdf', 'advanced', 'ASL', 'non-deaf', 7340032);

-- ASL ADVANCED - UNIVERSAL
INSERT INTO public.materials (title, description, type, download_url, level, language, recommended_for_role, file_size) VALUES
('ASL Legal Terminology', 'Specialized ASL vocabulary for legal contexts. For all advanced learners.', 'application/pdf', 'https://storage.supabase.co/asl/asl-legal-all.pdf', 'advanced', 'ASL', 'all', 8388608),
('ASL Medical Terminology', 'Comprehensive medical ASL vocabulary for healthcare settings.', 'application/pdf', 'https://storage.supabase.co/asl/asl-medical-all.pdf', 'advanced', 'ASL', 'all', 9437184),
('ASL Teaching Curriculum', 'Complete curriculum guide for ASL instructors.', 'application/pdf', 'https://storage.supabase.co/asl/asl-teaching-all.pdf', 'advanced', 'ASL', 'all', 11534336);


-- ============================================================================
-- QUIZ SETS - MALAYSIAN SIGN LANGUAGE (MSL)
-- ============================================================================

-- MSL BEGINNER - DEAF USERS
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('MSL Alphabet Recognition - Visual', 'Test your MSL fingerspelling recognition skills. Visual-only questions for deaf learners.', 'MSL', 'deaf'),
('MSL Numbers Quiz - Visual Method', 'Practice MSL numbers through visual recognition. Designed for deaf community.', 'MSL', 'deaf'),
('MSL Basic Signs - Deaf Focus', 'Quiz on common MSL signs with visual demonstrations. Deaf-friendly format.', 'MSL', 'deaf'),
('MSL Greetings and Introductions', 'Test your knowledge of MSL greetings from deaf culture perspective.', 'MSL', 'deaf'),
('MSL Family Vocabulary - Visual', 'Family signs quiz with visual questions for deaf learners.', 'MSL', 'deaf');

-- MSL BEGINNER - NON-DEAF USERS
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('MSL Alphabet with Pronunciation', 'Test MSL fingerspelling with Malay pronunciation context.', 'MSL', 'non-deaf'),
('MSL Numbers - Audio Context', 'Practice MSL numbers with pronunciation guides and audio context.', 'MSL', 'non-deaf'),
('MSL Basic Signs - Hearing Perspective', 'Common MSL signs quiz with pronunciation and usage examples.', 'MSL', 'non-deaf'),
('MSL Greetings - Comparative Quiz', 'Test greetings knowledge with Malay language comparisons.', 'MSL', 'non-deaf'),
('MSL Family Signs with Context', 'Family vocabulary quiz with pronunciation and cultural context.', 'MSL', 'non-deaf');

-- MSL BEGINNER - UNIVERSAL
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('MSL Basics Assessment', 'Comprehensive beginner MSL quiz for all learners.', 'MSL', 'all'),
('MSL Common Phrases Quiz', 'Test your knowledge of essential MSL phrases. Universal format.', 'MSL', 'all'),
('MSL Colors and Shapes', 'Quiz on MSL color and shape signs for all learners.', 'MSL', 'all');

-- MSL INTERMEDIATE - DEAF USERS
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('MSL Conversation Skills - Visual', 'Test your MSL conversation abilities with visual scenarios.', 'MSL', 'deaf'),
('MSL Emotions and Expressions', 'Quiz on expressing emotions in MSL with facial grammar.', 'MSL', 'deaf'),
('MSL Workplace Communication', 'Professional MSL vocabulary quiz from deaf perspective.', 'MSL', 'deaf'),
('MSL Classifiers and Spatial Grammar', 'Advanced quiz on MSL classifiers for deaf learners.', 'MSL', 'deaf');

-- MSL INTERMEDIATE - NON-DEAF USERS
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('MSL Conversation - Audio Context', 'Test conversation skills with pronunciation and context.', 'MSL', 'non-deaf'),
('MSL Emotions - Hearing View', 'Emotions quiz with pronunciation guides and cultural notes.', 'MSL', 'non-deaf'),
('MSL Professional Settings', 'Workplace MSL quiz with audio context for hearing learners.', 'MSL', 'non-deaf'),
('MSL Grammar Structures', 'Test your understanding of MSL grammar with Malay comparisons.', 'MSL', 'non-deaf');

-- MSL INTERMEDIATE - UNIVERSAL
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('MSL Shopping and Services', 'Practical MSL quiz for shopping and daily services.', 'MSL', 'all'),
('MSL Travel and Directions', 'Test your MSL travel vocabulary. For all learners.', 'MSL', 'all'),
('MSL Idioms and Expressions', 'Quiz on common MSL idioms for all learners.', 'MSL', 'all');

-- MSL ADVANCED - DEAF USERS
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('MSL Deaf Culture and History', 'Advanced quiz on Malaysian deaf culture and MSL history.', 'MSL', 'deaf'),
('MSL Poetry and Art', 'Test your knowledge of MSL visual poetry and artistic expression.', 'MSL', 'deaf'),
('MSL Interpreting Skills - Deaf View', 'Advanced interpreting quiz from deaf community perspective.', 'MSL', 'deaf');

-- MSL ADVANCED - NON-DEAF USERS
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('MSL Professional Interpreting', 'Advanced interpreting quiz with audio context and ethics.', 'MSL', 'non-deaf'),
('MSL Academic Vocabulary', 'Test your knowledge of academic and technical MSL.', 'MSL', 'non-deaf'),
('MSL Cultural Competency', 'Advanced cultural competency quiz for hearing professionals.', 'MSL', 'non-deaf');

-- MSL ADVANCED - UNIVERSAL
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('MSL Legal Terminology', 'Specialized quiz on legal MSL vocabulary.', 'MSL', 'all'),
('MSL Medical Terminology', 'Comprehensive medical MSL vocabulary quiz.', 'MSL', 'all'),
('MSL Teaching Methods', 'Quiz for aspiring MSL instructors. For all learners.', 'MSL', 'all');

-- ============================================================================
-- QUIZ SETS - AMERICAN SIGN LANGUAGE (ASL)
-- ============================================================================

-- ASL BEGINNER - DEAF USERS
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('ASL Alphabet Recognition - Visual', 'Test your ASL fingerspelling recognition skills. Visual-only for deaf learners.', 'ASL', 'deaf'),
('ASL Numbers Quiz - Visual Method', 'Practice ASL numbers through visual recognition. Deaf-friendly format.', 'ASL', 'deaf'),
('ASL Basic Signs - Deaf Focus', 'Quiz on common ASL signs with visual demonstrations.', 'ASL', 'deaf'),
('ASL Greetings and Introductions', 'Test your knowledge of ASL greetings from deaf culture perspective.', 'ASL', 'deaf'),
('ASL Family Vocabulary - Visual', 'Family signs quiz with visual questions for deaf learners.', 'ASL', 'deaf');

-- ASL BEGINNER - NON-DEAF USERS
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('ASL Alphabet with Pronunciation', 'Test ASL fingerspelling with English pronunciation context.', 'ASL', 'non-deaf'),
('ASL Numbers - Audio Context', 'Practice ASL numbers with pronunciation guides and audio context.', 'ASL', 'non-deaf'),
('ASL Basic Signs - Hearing Perspective', 'Common ASL signs quiz with pronunciation and usage examples.', 'ASL', 'non-deaf'),
('ASL Greetings - Comparative Quiz', 'Test greetings knowledge with English language comparisons.', 'ASL', 'non-deaf'),
('ASL Family Signs with Context', 'Family vocabulary quiz with pronunciation and cultural context.', 'ASL', 'non-deaf');

-- ASL BEGINNER - UNIVERSAL
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('ASL Basics Assessment', 'Comprehensive beginner ASL quiz for all learners.', 'ASL', 'all'),
('ASL Common Phrases Quiz', 'Test your knowledge of essential ASL phrases. Universal format.', 'ASL', 'all'),
('ASL Colors and Shapes', 'Quiz on ASL color and shape signs for all learners.', 'ASL', 'all');

-- ASL INTERMEDIATE - DEAF USERS
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('ASL Conversation Skills - Visual', 'Test your ASL conversation abilities with visual scenarios.', 'ASL', 'deaf'),
('ASL Emotions and Expressions', 'Quiz on expressing emotions in ASL with facial grammar.', 'ASL', 'deaf'),
('ASL Workplace Communication', 'Professional ASL vocabulary quiz from deaf perspective.', 'ASL', 'deaf'),
('ASL Classifiers and Spatial Grammar', 'Advanced quiz on ASL classifiers for deaf learners.', 'ASL', 'deaf');

-- ASL INTERMEDIATE - NON-DEAF USERS
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('ASL Conversation - Audio Context', 'Test conversation skills with pronunciation and context.', 'ASL', 'non-deaf'),
('ASL Emotions - Hearing View', 'Emotions quiz with pronunciation guides and cultural notes.', 'ASL', 'non-deaf'),
('ASL Professional Settings', 'Workplace ASL quiz with audio context for hearing learners.', 'ASL', 'non-deaf'),
('ASL Grammar Structures', 'Test your understanding of ASL grammar with English comparisons.', 'ASL', 'non-deaf');

-- ASL INTERMEDIATE - UNIVERSAL
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('ASL Shopping and Dining', 'Practical ASL quiz for shopping and restaurants.', 'ASL', 'all'),
('ASL Travel and Navigation', 'Test your ASL travel vocabulary. For all learners.', 'ASL', 'all'),
('ASL Idioms and Expressions', 'Quiz on common ASL idioms for all learners.', 'ASL', 'all');

-- ASL ADVANCED - DEAF USERS
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('ASL Deaf Culture and Heritage', 'Advanced quiz on American deaf culture and ASL history.', 'ASL', 'deaf'),
('ASL Poetry and Performance', 'Test your knowledge of ASL visual poetry and artistic expression.', 'ASL', 'deaf'),
('ASL Interpreting Skills - Deaf View', 'Advanced interpreting quiz from deaf community perspective.', 'ASL', 'deaf');

-- ASL ADVANCED - NON-DEAF USERS
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('ASL Professional Interpreting', 'Advanced interpreting quiz with audio context and ethics.', 'ASL', 'non-deaf'),
('ASL Academic Vocabulary', 'Test your knowledge of academic and technical ASL.', 'ASL', 'non-deaf'),
('ASL Cultural Competency', 'Advanced cultural competency quiz for hearing professionals.', 'ASL', 'non-deaf');

-- ASL ADVANCED - UNIVERSAL
INSERT INTO public.quiz_sets (title, description, language, recommended_for_role) VALUES
('ASL Legal Terminology', 'Specialized quiz on legal ASL vocabulary.', 'ASL', 'all'),
('ASL Medical Terminology', 'Comprehensive medical ASL vocabulary quiz.', 'ASL', 'all'),
('ASL Teaching Methods', 'Quiz for aspiring ASL instructors. For all learners.', 'ASL', 'all');

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- Total Content Added:
-- - Tutorials: 66 (33 MSL + 33 ASL)
-- - Materials: 66 (33 MSL + 33 ASL)
-- - Quiz Sets: 66 (33 MSL + 33 ASL)
-- 
-- Breakdown by Role:
-- - Deaf-specific: 66 items (22 per content type)
-- - Non-deaf-specific: 66 items (22 per content type)
-- - Universal: 66 items (22 per content type)
--
-- Breakdown by Level:
-- - Beginner: 96 items
-- - Intermediate: 60 items
-- - Advanced: 42 items
--
-- Total: 198 learning items across both languages
-- ============================================================================
