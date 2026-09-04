-- Sample data for Cervical Cancer Awareness System

USE cervical_cancer_awareness;

-- Insert Categories
INSERT INTO categories (name, description, icon, color) VALUES
('Prevention', 'Learn about ways to prevent cervical cancer', '🛡️', '#4CAF50'),
('Screening & Testing', 'Information about screening tests and procedures', '🔬', '#2196F3'),
('HPV & Vaccine', 'Understanding HPV and vaccination options', '💉', '#FF9800'),
('Symptoms & Diagnosis', 'Recognize symptoms and diagnostic procedures', '⚠️', '#F44336'),
('Treatment Options', 'Explore various treatment approaches', '❤️', '#9C27B0'),
('Support & Resources', 'Find support groups and helpful resources', '👥', '#00BCD4');

-- Insert Sample Content
INSERT INTO content (category_id, title, description, content, author) VALUES
(1, 'Prevention Through Vaccination', 'HPV vaccination is one of the most effective ways to prevent cervical cancer', 
'Cervical cancer is largely preventable through vaccination. The HPV vaccine protects against the most common types of HPV that cause cervical cancer. It is most effective when given before sexual activity begins. Clinical trials have shown the vaccine to be over 99% effective in preventing infection with HPV types 16 and 18.',
'Health Expert'),

(1, 'Healthy Lifestyle Habits', 'Healthy habits can significantly reduce your risk', 
'Maintaining a healthy lifestyle is crucial for reducing cervical cancer risk. This includes regular exercise, a balanced diet rich in fruits and vegetables, avoiding smoking, limiting alcohol consumption, and managing stress effectively. A strong immune system is better equipped to fight off HPV infections.',
'Wellness Coach'),

(2, 'Understanding Pap Smear Test', 'The Pap smear is a crucial screening tool', 
'The Pap smear (Pap test) is a procedure to test for precancerous or cancerous cells on the cervix. It is one of the most effective screening tools and can detect abnormal cells before they become cancerous. Regular Pap smears have significantly reduced cervical cancer rates in developed countries.',
'Medical Professional'),

(2, 'HPV Testing Explained', 'HPV testing helps detect the virus early', 
'HPV (Human Papillomavirus) testing can detect the presence of high-risk HPV types in cervical cells. This test is often performed alongside a Pap smear and helps identify women at higher risk for cervical cancer. HPV testing is becoming increasingly common in screening programs.',
'Health Expert'),

(3, 'Types of HPV', 'Not all HPV types are equally dangerous', 
'There are over 100 types of HPV, but only about 15 are considered high-risk for cervical cancer. HPV 16 and 18 are responsible for approximately 70% of cervical cancer cases. Understanding HPV types helps in risk assessment and appropriate treatment planning.',
'Research Scientist'),

(3, 'Vaccine Effectiveness', 'How effective is the HPV vaccine?', 
'The HPV vaccine has proven to be over 99% effective in preventing infection with HPV types 16 and 18 when administered before exposure. It is recommended for ages 11-26, and can be given up to age 45. The vaccine works by training the immune system to recognize and fight HPV before infection occurs.',
'Medical Director'),

(4, 'Common Symptoms', 'Know the warning signs', 
'While early-stage cervical cancer often has no symptoms, later stages may include abnormal vaginal bleeding, pelvic pain, vaginal discharge with an unpleasant odor, and pain during intercourse. Any unusual symptoms should be discussed with a healthcare provider immediately.',
'Gynecologist'),

(4, 'Diagnostic Procedures', 'What to expect if abnormalities are found', 
'If screening tests detect abnormalities, further diagnostic procedures may be recommended. These can include colposcopy (magnified examination), biopsy (tissue sample), or additional imaging studies. These procedures help confirm the diagnosis and determine the stage of disease for appropriate treatment.',
'Medical Specialist'),

(5, 'Surgical Treatment Options', 'Understanding surgical approaches', 
'Surgical options for cervical cancer include conization (cone biopsy), hysterectomy (removal of uterus), and trachelectomy (removal of cervix while preserving uterus). The choice depends on cancer stage, patient age, and fertility desires. Modern minimally invasive techniques can reduce recovery time.',
'Surgical Oncologist'),

(6, 'Finding Support Groups', 'Connect with others on this journey', 
'Support groups provide emotional support, practical advice, and community. Many cancer centers offer support groups for patients and survivors. Online communities also provide opportunities to connect with others who understand the experience. Counseling and mental health services can also be beneficial.',
'Patient Advocate');

-- Insert Sample Quizzes
INSERT INTO quizzes (title, description, category_id, difficulty_level, passing_score) VALUES
('Cervical Cancer Prevention Quiz', 'Test your knowledge on prevention methods', 1, 'beginner', 70),
('Screening & Testing Basics', 'Learn about screening procedures', 2, 'beginner', 70),
('HPV Knowledge Assessment', 'Comprehensive HPV and vaccine quiz', 3, 'intermediate', 75),
('Symptoms & Diagnosis Evaluation', 'Test your understanding of symptoms', 4, 'intermediate', 70);

-- Insert Quiz Questions
INSERT INTO quiz_questions (quiz_id, question, position) VALUES
(1, 'At what age should HPV vaccination ideally begin?', 1),
(1, 'Is HPV vaccination effective for people who have already been sexually active?', 2),
(1, 'Which of the following is NOT a natural way to boost immunity?', 3),
(2, 'How often should women get a Pap smear screening?', 1),
(2, 'The Pap smear can detect all types of cervical cancer', 2),
(3, 'What does HPV stand for?', 1),
(3, 'Which HPV types are most commonly associated with cervical cancer?', 2),
(4, 'What is one common symptom of cervical cancer?', 1),
(4, 'At what stage is cervical cancer most treatable?', 2);

-- Insert Quiz Answers
INSERT INTO quiz_answers (question_id, answer_text, is_correct, position) VALUES
(1, 'At age 11-12', 1, 1),
(1, 'At age 21', 0, 2),
(1, 'At age 30', 0, 3),
(1, 'At age 40', 0, 4),
(2, 'Yes, still beneficial', 1, 1),
(2, 'No, not effective', 0, 2),
(3, 'Smoking', 1, 1),
(3, 'Exercise', 0, 2),
(3, 'Healthy diet', 0, 3),
(3, 'Sleep', 0, 4),
(4, 'Every 3-5 years', 1, 1),
(4, 'Every year', 0, 2),
(4, 'Only when symptoms appear', 0, 3),
(4, 'Once in a lifetime', 0, 4),
(5, 'False - Pap cannot detect all cancers', 1, 1),
(5, 'True - Pap detects all cancers', 0, 2),
(6, 'Human Papillomavirus', 1, 1),
(6, 'Health Prevention Virus', 0, 2),
(6, 'Human Protection Protein', 0, 3),
(7, 'HPV 16 and 18', 1, 1),
(7, 'HPV 1 and 2', 0, 2),
(7, 'All HPV types equally', 0, 3),
(8, 'Abnormal vaginal bleeding', 1, 1),
(8, 'Fever every day', 0, 2),
(8, 'Loss of appetite', 0, 3),
(9, 'Early stage when caught early', 1, 1),
(9, 'Advanced stage only', 0, 2),
(9, 'No stage is treatable', 0, 3);
