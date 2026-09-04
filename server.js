const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

// Activity records intentionally live for the lifetime of this server process.
// This keeps analytics real without introducing a database requirement.
const activities = [];

const siteData = {
  categories: [
   {
     id: 1,
     name: 'Prevention',
     icon: '🛡️',
     description: 'Learn how vaccination, safe habits, and regular checkups reduce cervical cancer risk.',
     highlights: ['HPV vaccination', 'Healthy routines', 'Routine checkups'],
     topicDetails: {
       'HPV vaccination': 'The HPV vaccine helps prevent infection from the HPV types that cause most cervical cancers. It works best before exposure, and a healthcare provider can advise on the recommended schedule for your age.',
       'Healthy routines': 'Avoiding tobacco, using condoms, and choosing habits that support your immune system can lower health risks. Healthy routines work alongside vaccination and screening; they do not replace either one.',
       'Routine checkups': 'Regular visits give you a chance to stay up to date with screening, discuss vaccination, and ask about changes in your health. Follow the screening schedule recommended by your local healthcare service.'
     }
   },
   {
     id: 2,
     name: 'Screening',
     icon: '🩺',
     description: 'Understand Pap tests, HPV testing, and why early screening changes outcomes.',
     highlights: ['Pap smear', 'HPV testing', 'Early detection'],
     topicDetails: {
       'Pap smear': 'A Pap test checks cells from the cervix for changes that could become serious. It is a screening test, not a diagnosis, and an abnormal result usually means follow-up is needed rather than that cancer is present.',
       'HPV testing': 'An HPV test looks for high-risk types of human papillomavirus linked to cervical cell changes. Your provider can explain which test is appropriate and when you should repeat it.',
       'Early detection': 'Screening can find cell changes before symptoms appear, when monitoring or treatment is often simpler. Keep follow-up appointments even when you feel well.'
     }
   },
   {
     id: 3,
     name: 'Symptoms',
     icon: '⚠️',
     description: 'Know the warning signs, while remembering that early disease may not cause symptoms.',
     highlights: ['Unusual bleeding', 'Pelvic discomfort', 'Persistent symptoms'],
     topicDetails: {
       'Unusual bleeding': 'Bleeding between periods, after sex, or after menopause should be discussed with a healthcare professional, especially when it is new or recurring. Many causes are not cancer, but it should be checked.',
       'Pelvic discomfort': 'Ongoing pelvic pain or pain during sex can have many causes. Make an appointment if discomfort persists, worsens, or occurs with bleeding or unusual discharge.',
       'Persistent symptoms': 'Early cervical changes may cause no symptoms. Do not wait for symptoms to begin screening, and seek care when a change continues or concerns you.'
     }
   },
   {
     id: 4,
     name: 'Support',
     icon: '🤝',
     description: 'Find trusted information, support networks, and steps to talk with a care provider.',
     highlights: ['Care teams', 'Community help', 'Patient resources'],
     topicDetails: {
       'Care teams': 'A nurse, doctor, or clinic can explain screening results, vaccination, symptoms, and next steps. Write down questions and bring someone you trust if that helps you feel comfortable.',
       'Community help': 'Trusted community health workers and local clinics can help people find screening services, understand appointments, and overcome practical barriers to care.',
       'Patient resources': 'Use reliable health information from public health agencies, hospitals, and qualified clinicians. Be cautious of claims that promise a guaranteed cure or say screening is unnecessary.'
     }
   }
  ],
  articles: [
   {
     id: 1,
     category: 'Prevention',
     title: 'Why HPV vaccination matters before exposure',
     summary: 'HPV vaccination is most effective before any sexual exposure and remains a strong prevention strategy.',
     content: 'Human papillomavirus (HPV) is a common infection linked to several cancers, including cervical cancer. Vaccination can prevent many of the HPV strains associated with these diseases when given before exposure. This makes it one of the strongest preventive tools available, especially for adolescents and young adults.'
   },
   {
     id: 2,
     category: 'Screening',
     title: 'What regular screening can catch early',
     summary: 'Screening helps detect abnormal changes before symptoms form, when treatment is often simpler.',
     content: 'Cervical screening is designed to detect abnormal cell changes before they become cancer. Pap tests and HPV testing are not diagnostic of cancer by themselves, but they help clinicians decide whether more follow-up is needed. Regular screening is one of the best ways to reduce preventable disease risk.'
   },
   {
     id: 3,
     category: 'Symptoms',
     title: 'Recognizing symptoms without panic',
     summary: 'Many cases show no symptoms early, so persistent changes should still be checked by a clinician.',
     content: 'Early cervical abnormalities often do not cause any symptoms. As disease advances, some people may notice unusual bleeding, pelvic pain, or unusual discharge. These signs should be assessed by a healthcare professional, especially if they are persistent or worsening.'
   },
   {
     id: 4,
     category: 'Support',
     title: 'How to talk to your provider with confidence',
     summary: 'Good communication with a care team can improve screening, prevention, and referrals when needed.',
     content: 'Asking questions about screening, symptoms, vaccination, and preventive care can help you feel informed. Bringing a list of questions, concerns, or timing details can make a visit more productive and help you feel supported throughout the process.'
   }
  ],
  faqs: [
   {
     id: 1,
     question: 'What is cervical cancer?',
     answer: 'Cervical cancer starts in the cervix, the lower part of the uterus. It is most often linked to long-lasting high-risk HPV infection.'
   },
   {
     id: 2,
     question: 'Can cervical cancer be prevented?',
     answer: 'Yes, in many cases. Prevention includes HPV vaccination, regular screening, avoiding smoking, and discussing risk factors with a healthcare professional.'
   },
   {
     id: 3,
     question: 'Should a person get screened even if they feel healthy?',
     answer: 'Yes. Early cervical changes usually do not cause symptoms, so screening is one of the best ways to catch problems before they become serious.'
   },
   {
     id: 4,
     question: 'What should I do if I notice unusual bleeding or pelvic pain?',
     answer: 'Follow up with a healthcare professional. Persistent symptoms should be assessed, especially if they are new, recurring, or worsening.'
   },
   {
     id: 5,
     question: 'How does HPV lead to cervical cancer?',
     answer: 'High-risk HPV infections can persist over time and trigger abnormal cell changes in the cervix. That is why vaccination and screening are both important prevention tools.'
   },
   {
     id: 6,
     question: 'At what age should screening begin?',
     answer: 'Screening recommendations vary by country and risk factors, but many guidance frameworks begin screening at an age determined by local public health guidance. A healthcare professional can advise on the right schedule.'
   },
   {
     id: 7,
     question: 'Is the HPV vaccine still useful if someone is already sexually active?',
     answer: 'It can still offer protection against HPV strains they have not yet been exposed to. It is most effective before exposure, but it may still be useful depending on age and risk history.'
   },
   {
     id: 8,
     question: 'How often should someone check in about cervical health?',
     answer: 'Routine screenings should follow local medical guidance and personal risk factors. If you have new symptoms or a high-risk history, speak with your clinician sooner.'
   }
  ],
  quiz: [
   {
     question: 'What causes most cervical cancers?',
     options: ['Persistent high-risk HPV infection', 'A common cold', 'A lack of exercise', 'Eating spicy food'],
     answer: 0
   },
   {
     question: 'Why is routine screening important?',
     options: ['It can detect changes before symptoms appear', 'It replaces vaccination', 'It is only for people with pain', 'It guarantees cancer never develops'],
     answer: 0
   },
   {
     question: 'When is HPV vaccination most effective?',
     options: ['Before exposure to HPV', 'Only after a cancer diagnosis', 'Only after menopause', 'After symptoms begin'],
     answer: 0
   },
   {
     question: 'What should someone do about persistent unusual bleeding?',
     options: ['Discuss it with a healthcare professional', 'Ignore it', 'Wait for severe pain', 'Use an unproven remedy'],
     answer: 0
   },
   {
     question: 'What does a Pap test examine?',
     options: ['Cells from the cervix', 'Blood pressure', 'Lung capacity', 'Blood sugar'],
     answer: 0
   },
   {
     question: 'What does an HPV test look for?',
     options: ['High-risk HPV types', 'Anemia', 'Diabetes', 'A bacterial cold'],
     answer: 0
   },
   {
     question: 'Can early cervical cell changes have no symptoms?',
     options: ['Yes', 'No, they always cause pain', 'Only in children', 'Only after treatment'],
     answer: 0
   },
   {
     question: 'Who should explain an abnormal screening result?',
     options: ['A qualified healthcare professional', 'A social media post', 'A random online comment', 'No one'],
     answer: 0
   },
   {
     question: 'Which habit increases cervical cancer risk?',
     options: ['Smoking tobacco', 'Drinking water', 'Wearing a seat belt', 'Sleeping regularly'],
     answer: 0
   },
   {
     question: 'Does HPV vaccination replace cervical screening?',
     options: ['No', 'Yes, always', 'Only after age 30', 'Only when symptoms occur'],
     answer: 0
   },
   {
     question: 'Can HPV affect people of any gender?',
     options: ['Yes', 'No', 'Only newborns', 'Only people with cancer'],
     answer: 0
   },
   {
     question: 'What is the cervix?',
     options: ['The lower part of the uterus', 'A lung muscle', 'A type of vaccine', 'A blood cell'],
     answer: 0
   },
   {
     question: 'What is the purpose of follow-up after an abnormal test?',
     options: ['To understand the change and decide on care', 'To prove the test was useless', 'To avoid all future care', 'To diagnose every result as cancer'],
     answer: 0
   },
   {
     question: 'Which symptom should be checked if it persists?',
     options: ['Pelvic pain or discomfort', 'A brief sneeze', 'Temporary thirst', 'Normal tiredness after exercise'],
     answer: 0
   },
   {
     question: 'Can condoms reduce, but not eliminate, HPV transmission risk?',
     options: ['Yes', 'No', 'Only after cancer', 'Only during screening'],
     answer: 0
   },
   {
     question: 'Why are trusted health sources important?',
     options: ['They provide evidence-based information', 'They guarantee a personal diagnosis', 'They replace a clinician', 'They remove the need for screening'],
     answer: 0
   },
   {
     question: 'What should you bring to a screening appointment?',
     options: ['Questions and relevant health information', 'A promise to skip follow-up', 'Unverified test results only', 'Nothing if you have symptoms'],
     answer: 0
   },
   {
     question: 'What does prevention usually involve?',
     options: ['Vaccination, screening, and healthy choices', 'Only home remedies', 'Avoiding all medical visits', 'Waiting for symptoms'],
     answer: 0
   },
   {
     question: 'Is every HPV infection linked to cancer?',
     options: ['No, but persistent high-risk infections can cause cell changes', 'Yes, immediately', 'Only low-risk types cause cancer', 'HPV never affects cells'],
     answer: 0
   },
   {
     question: 'What should happen if symptoms worsen?',
     options: ['Seek medical advice promptly', 'Ignore them', 'Share them only online', 'Stop all prescribed care'],
     answer: 0
   },
   {
     question: 'Can screening find problems before cancer develops?',
     options: ['Yes', 'Never', 'Only after treatment', 'Only when pain is severe'],
     answer: 0
   },
   {
     question: 'Who can help someone find local screening services?',
     options: ['A clinic or community health worker', 'An anonymous rumor', 'A product advertisement', 'No one'],
     answer: 0
   },
   {
     question: 'Should vaccination timing follow local medical guidance?',
     options: ['Yes', 'No', 'Only for people with symptoms', 'Only after a positive test'],
     answer: 0
   },
   {
     question: 'What is a screening test?',
     options: ['A test for people who may feel healthy to find early changes', 'A guaranteed cancer diagnosis', 'A treatment', 'A replacement for talking to a clinician'],
     answer: 0
   },
   {
     question: 'What is a helpful response to a health myth?',
     options: ['Check reliable sources and ask a professional', 'Share it immediately', 'Stop screening', 'Assume it is true'],
     answer: 0
   },
   {
     question: 'Can people with no symptoms still need screening?',
     options: ['Yes', 'No', 'Only after pain begins', 'Only after treatment'],
     answer: 0
   },
   {
     question: 'What may persistent HPV infection cause?',
     options: ['Abnormal changes in cervical cells', 'A broken bone', 'Improved vision', 'A common cold'],
     answer: 0
   },
   {
     question: 'What is the best source for an individual screening schedule?',
     options: ['A healthcare professional using local guidance', 'A random quiz', 'A friend’s schedule', 'An online advertisement'],
     answer: 0
   },
   {
     question: 'Why should someone avoid smoking?',
     options: ['Smoking can increase health risks, including cervical cancer risk', 'It prevents HPV', 'It replaces vaccination', 'It makes screening unnecessary'],
     answer: 0
   },
   {
     question: 'What can make a healthcare visit more productive?',
     options: ['Writing down questions and symptoms', 'Hiding symptoms', 'Skipping results', 'Using only social media advice'],
     answer: 0
   },
   {
     question: 'What should educational information replace?',
     options: ['Nothing; it should support, not replace, professional medical advice', 'All medical care', 'Vaccination', 'Screening'],
     answer: 0
   }
  ]
};

const adminUser = {
  email: 'admin@awareness.local',
  password: 'Awareness@2026'
};

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'cervical-awareness-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
   httpOnly: true,
   secure: false,
   sameSite: 'lax',
   maxAge: 60 * 60 * 1000
  }
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Cervical cancer awareness site is running.' });
});

app.post('/api/activity', (req, res) => {
  const allowedTypes = new Set([
    'page_view', 'article_view', 'category_view',
    'quiz_start', 'quiz_completion', 'quiz_submission'
  ]);
  const { type, page, contentId, score, total } = req.body || {};
  if (!allowedTypes.has(type)) {
    return res.status(400).json({ success: false, message: 'Unsupported activity type.' });
  }
  activities.push({
    type,
    page: String(page || '').slice(0, 200),
    contentId: Number.isFinite(Number(contentId)) ? Number(contentId) : null,
    score: Number.isFinite(Number(score)) ? Number(score) : null,
    total: Number.isFinite(Number(total)) ? Number(total) : null,
    timestamp: new Date().toISOString()
  });
  return res.status(201).json({ success: true });
});

app.get('/api/site-data', (req, res) => {
  res.json(siteData);
});

app.get('/api/categories', (req, res) => {
  res.json(siteData.categories);
});

app.get('/api/articles', (req, res) => {
  res.json(siteData.articles);
});

app.get('/api/articles/:id', (req, res) => {
  const articleId = Number(req.params.id);
  const article = siteData.articles.find(item => item.id === articleId);

  if (!article) {
   return res.status(404).json({ success: false, message: 'Article not found.' });
  }

  return res.json(article);
});

app.get('/api/faq', (req, res) => {
  res.json(siteData.faqs);
});

app.get('/api/quiz', (req, res) => {
  res.json(siteData.quiz);
});

app.post('/api/quiz/submit', (req, res) => {
  const { answers = [] } = req.body;
  let score = 0;

  siteData.quiz.forEach((item, idx) => {
   if (Number(answers[idx]) === Number(item.answer)) {
     score += 1;
   }
  });

  const percentage = Math.round((score / siteData.quiz.length) * 100);
  activities.push({ type: 'quiz_submission', page: '/quiz', score, total: siteData.quiz.length, contentId: null, timestamp: new Date().toISOString() });
  activities.push({ type: 'quiz_completion', page: '/quiz', score, total: siteData.quiz.length, contentId: null, timestamp: new Date().toISOString() });

  res.json({
   success: true,
   score,
   total: siteData.quiz.length,
   percentage,
   message: percentage >= 75 ? 'Excellent! You have a strong grasp of the key facts.' : percentage >= 50 ? 'Good effort—keep learning and revisit the prevention basics.' : 'Nice start—review the awareness topics and try again soon.'
  });
});

app.get('/api/search', (req, res) => {
  const query = (req.query.q || '').toString().trim().toLowerCase();

  if (!query) {
   return res.json({ categories: siteData.categories, articles: siteData.articles });
  }

  const filteredCategories = siteData.categories.filter(item =>
   item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
  );

  const filteredArticles = siteData.articles.filter(item =>
   item.title.toLowerCase().includes(query) ||
   item.summary.toLowerCase().includes(query) ||
   item.category.toLowerCase().includes(query)
  );

  return res.json({ categories: filteredCategories, articles: filteredArticles });
});


app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (email === adminUser.email && password === adminUser.password) {
   req.session.admin = true;
   req.session.name = 'Admin';
   return res.json({ success: true, message: 'Login successful.' });
  }

  return res.status(401).json({ success: false, message: 'Invalid email or password.' });
});

app.get('/api/admin/overview', (req, res) => {
  if (!req.session.admin) {
   return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const articleViews = siteData.articles.map((article) => ({
    label: article.title,
    value: activities.filter((item) => item.type === 'article_view' && item.contentId === article.id).length
  }));
  const categoryViews = siteData.categories.map((category) => ({
    label: category.name,
    value: activities.filter((item) => item.type === 'category_view' && item.contentId === category.id).length
  }));

  return res.json({
   success: true,
   stats: {
     categories: siteData.categories.length,
     articles: siteData.articles.length,
     faqs: siteData.faqs.length,
     quizQuestions: siteData.quiz.length,
     pageViews: activities.filter((item) => item.type === 'page_view').length,
     articleViews: activities.filter((item) => item.type === 'article_view').length,
     categoryViews: activities.filter((item) => item.type === 'category_view').length,
     quizStarts: activities.filter((item) => item.type === 'quiz_start').length,
     quizCompletions: activities.filter((item) => item.type === 'quiz_completion').length,
     quizSubmissions: activities.filter((item) => item.type === 'quiz_submission').length,
     avgScore: (() => {
       const submissions = activities.filter((item) => item.type === 'quiz_submission' && item.total);
       return submissions.length ? Math.round(submissions.reduce((sum, item) => sum + (item.score / item.total) * 100, 0) / submissions.length) : 0;
     })(),
     articleViewsByContent: articleViews,
     categoryViewsByContent: categoryViews
   }
  });
});

app.get('/api/admin/activities', requireAdmin, (req, res) => {
  return res.json({ success: true, activities: activities.slice(-200) });
});

app.get('/api/admin/content', requireAdmin, (req, res) => {
  return res.json({
   success: true,
   categories: siteData.categories,
   articles: siteData.articles,
   faqs: siteData.faqs
  });
});

app.post('/api/admin/content', requireAdmin, (req, res) => {
  const { section, id, name, icon, description, highlights, title, summary, category, content, question, answer } = req.body || {};

  if (!section) {
   return res.status(400).json({ success: false, message: 'A content section is required.' });
  }

  if (section === 'category') {
   const cleanName = String(name || '').trim();
   const cleanDescription = String(description || '').trim();
   const cleanIcon = String(icon || '🩺').trim() || '🩺';
   if (!cleanName || !cleanDescription) {
     return res.status(400).json({ success: false, message: 'Category name and description are required.' });
   }

   const nextCategory = {
     id: Number(id) || Date.now(),
     name: cleanName,
     icon: cleanIcon,
     description: cleanDescription,
     highlights: Array.isArray(highlights) ? highlights.map((item) => String(item).trim()).filter(Boolean) : String(highlights || '').split(',').map((item) => item.trim()).filter(Boolean)
   };

   if (id) {
     const index = siteData.categories.findIndex((item) => item.id === Number(id));
     if (index >= 0) {
       siteData.categories[index] = nextCategory;
     } else {
       siteData.categories.push(nextCategory);
     }
   } else {
     siteData.categories.push(nextCategory);
   }

   return res.json({ success: true, item: nextCategory, categories: siteData.categories });
  }

  if (section === 'article') {
   const cleanTitle = String(title || '').trim();
   const cleanSummary = String(summary || '').trim();
   const cleanCategory = String(category || '').trim();
   const cleanContent = String(content || '').trim();

   if (!cleanTitle || !cleanSummary || !cleanCategory || !cleanContent) {
     return res.status(400).json({ success: false, message: 'Title, category, summary, and content are required.' });
   }

   const nextArticle = {
     id: Number(id) || Date.now(),
     title: cleanTitle,
     summary: cleanSummary,
     category: cleanCategory,
     content: cleanContent
   };

   if (id) {
     const index = siteData.articles.findIndex((item) => item.id === Number(id));
     if (index >= 0) {
       siteData.articles[index] = nextArticle;
     } else {
       siteData.articles.push(nextArticle);
     }
   } else {
     siteData.articles.push(nextArticle);
   }

   return res.json({ success: true, item: nextArticle, articles: siteData.articles });
  }

  if (section === 'faq') {
   const cleanQuestion = String(question || '').trim();
   const cleanAnswer = String(answer || '').trim();

   if (!cleanQuestion || !cleanAnswer) {
     return res.status(400).json({ success: false, message: 'Question and answer are required.' });
   }

   const nextFaq = {
     id: Number(id) || Date.now(),
     question: cleanQuestion,
     answer: cleanAnswer
   };

   if (id) {
     const index = siteData.faqs.findIndex((item) => item.id === Number(id));
     if (index >= 0) {
       siteData.faqs[index] = nextFaq;
     } else {
       siteData.faqs.push(nextFaq);
     }
   } else {
     siteData.faqs.push(nextFaq);
   }

   return res.json({ success: true, item: nextFaq, faqs: siteData.faqs });
  }

  return res.status(400).json({ success: false, message: 'Unsupported content section.' });
});

app.delete('/api/admin/content/:section/:id', requireAdmin, (req, res) => {
  const { section, id } = req.params;
  const numericId = Number(id);

  if (!numericId) {
   return res.status(400).json({ success: false, message: 'A valid content id is required.' });
  }

  if (section === 'category') {
   siteData.categories = siteData.categories.filter((item) => item.id !== numericId);
   return res.json({ success: true, categories: siteData.categories });
  }

  if (section === 'article') {
   siteData.articles = siteData.articles.filter((item) => item.id !== numericId);
   return res.json({ success: true, articles: siteData.articles });
  }

  if (section === 'faq') {
   siteData.faqs = siteData.faqs.filter((item) => item.id !== numericId);
   return res.json({ success: true, faqs: siteData.faqs });
  }

  return res.status(400).json({ success: false, message: 'Unsupported content section.' });
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy(() => {
   res.json({ success: true, message: 'Logged out.' });
  });
});

function requireAdmin(req, res, next) {
  if (!req.session.admin) {
   return res.redirect('/admin');
  }
  return next();
}

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-login.html'));
});

app.get('/admin/dashboard', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/dashboard', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/categories', (req, res) => {
  res.sendFile(path.join(__dirname, 'categories.html'));
});

app.get('/article', (req, res) => {
  res.sendFile(path.join(__dirname, 'article.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'about-modern.html'));
});

app.get('/faq', (req, res) => {
  res.sendFile(path.join(__dirname, 'faq-modern.html'));
});

app.get('/disclaimer', (req, res) => {
  res.sendFile(path.join(__dirname, 'disclaimer-modern.html'));
});

app.get('/quiz', (req, res) => {
  res.sendFile(path.join(__dirname, 'quiz-modern.html'));
});

app.get('/home.html', (req, res) => {
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(__dirname));

app.use((req, res) => {
  if (req.accepts('html')) {
   res.status(404).send('<h1>Page not found</h1><p>The awareness site does not have this page yet.</p>');
   return;
  }
  res.status(404).json({ success: false, message: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Cervical Cancer Awareness site running at http://localhost:${PORT}`);
});
