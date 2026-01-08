-- Migration: fix_asl_test_language_data_v2
-- Description: Corrects the language for the American Sign Language Proficiency Test from MSL to ASL.

UPDATE proficiency_tests 
SET language = 'ASL' 
WHERE title = 'American Sign Language Proficiency Test';
