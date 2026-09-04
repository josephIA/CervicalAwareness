const showToast = (message) => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
};

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
};

const trackActivity = (type, details = {}) => {
  fetch('/api/activity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, page: window.location.pathname, ...details }),
    keepalive: true
  }).catch(() => undefined);
};

const categoryTopicDetails = {
  'HPV vaccination': 'The HPV vaccine helps prevent infection from the HPV types that cause most cervical cancers. It works best before exposure, and a healthcare provider can advise on the recommended schedule for your age.',
  'Healthy routines': 'Avoiding tobacco, using condoms, and choosing habits that support your immune system can lower health risks. Healthy routines work alongside vaccination and screening; they do not replace either one.',
  'Routine checkups': 'Regular visits give you a chance to stay up to date with screening, discuss vaccination, and ask about changes in your health. Follow the screening schedule recommended by your local healthcare service.',
  'Pap smear': 'A Pap test checks cells from the cervix for changes that could become serious. It is a screening test, not a diagnosis, and an abnormal result usually means follow-up is needed rather than that cancer is present.',
  'HPV testing': 'An HPV test looks for high-risk types of human papillomavirus linked to cervical cell changes. Your provider can explain which test is appropriate and when you should repeat it.',
  'Early detection': 'Screening can find cell changes before symptoms appear, when monitoring or treatment is often simpler. Keep follow-up appointments even when you feel well.',
  'Unusual bleeding': 'Bleeding between periods, after sex, or after menopause should be discussed with a healthcare professional, especially when it is new or recurring. Many causes are not cancer, but it should be checked.',
  'Pelvic discomfort': 'Ongoing pelvic pain or pain during sex can have many causes. Make an appointment if discomfort persists, worsens, or occurs with bleeding or unusual discharge.',
  'Persistent symptoms': 'Early cervical changes may cause no symptoms. Do not wait for symptoms to begin screening, and seek care when a change continues or concerns you.',
  'Care teams': 'A nurse, doctor, or clinic can explain screening results, vaccination, symptoms, and next steps. Write down questions and bring someone you trust if that helps you feel comfortable.',
  'Community help': 'Trusted community health workers and local clinics can help people find screening services, understand appointments, and overcome practical barriers to care.',
  'Patient resources': 'Use reliable health information from public health agencies, hospitals, and qualified clinicians. Be cautious of claims that promise a guaranteed cure or say screening is unnecessary.'
};

const renderSiteCards = async () => {
  const root = document.getElementById('featuredContent');
  if (!root) return;

  try {
    const data = await fetchJson('/api/site-data');
    const cards = data.articles.slice(0, 3);
    root.innerHTML = cards.map((article) => `
      <article class="article-card">
        <div class="icon">📘</div>
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
        <div class="badge-row">
          <span class="badge">${article.category}</span>
        </div>
        <div style="margin-top:1rem; display:flex; gap:0.8rem; align-items:center; flex-wrap:wrap;">
          <a class="btn btn-ghost btn-small" href="/article?id=${article.id}">Read</a>
        </div>
      </article>
    `).join('');
  } catch (error) {
    root.innerHTML = '<div class="content-panel"><p>Unable to load featured content right now.</p></div>';
  }
};

const renderCategoriesPage = async () => {
  const container = document.getElementById('categoryList');
  if (!container) return;

  try {
    const data = await fetchJson('/api/categories');
    container.innerHTML = data.map((category) => `
      <article class="feature-card">
        <div class="icon">${category.icon}</div>
        <h3>${category.name}</h3>
        <p>${category.description}</p>
        <div class="topic-writeups">
          ${category.highlights.map((tag) => `
            <details class="topic-writeup">
              <summary>${tag}</summary>
              <p>${category.topicDetails?.[tag] || categoryTopicDetails[tag] || 'Explore this topic with a qualified healthcare professional and trusted public health resources.'}</p>
            </details>
          `).join('')}
        </div>
      </article>
    `).join('');
    data.forEach((category) => trackActivity('category_view', { contentId: category.id }));
  } catch (error) {
    container.innerHTML = '<p>Unable to load categories.</p>';
  }
};

const renderArticlesPage = async () => {
  const container = document.getElementById('articleList');
  if (!container) return;

  try {
    const data = await fetchJson('/api/articles');
    container.innerHTML = data.map((article) => `
      <article class="article-card">
        <div class="icon">🧠</div>
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
        <div class="badge-row">
          <span class="badge">${article.category}</span>
        </div>
        <div style="margin-top:1rem; display:flex; gap:0.8rem; flex-wrap:wrap;">
          <a class="btn btn-ghost btn-small" href="/article?id=${article.id}">Read more</a>
        </div>
      </article>
    `).join('');
  } catch (error) {
    container.innerHTML = '<p>Unable to load article list.</p>';
  }
};

const renderArticleDetail = async () => {
  const articleRoot = document.getElementById('articleDetail');
  if (!articleRoot) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id') || 1);

  try {
    const article = await fetchJson(`/api/articles/${id}`);
    articleRoot.innerHTML = `
      <div class="content-panel article-detail">
        <div class="badge-row"><span class="badge">${article.category}</span></div>
        <h2>${article.title}</h2>
        <p>${article.content}</p>
        <div class="article-actions">
        </div>
      </div>
    `;
    trackActivity('article_view', { contentId: article.id });
  } catch (error) {
    articleRoot.innerHTML = '<div class="content-panel"><p>Article could not be found.</p></div>';
  }
};

const renderFaqs = async () => {
  const faqRoot = document.getElementById('faqList');
  if (!faqRoot) return;

  try {
    const faqs = await fetchJson('/api/faq');
    faqRoot.innerHTML = faqs.map((item, index) => `
      <div class="faq-item ${index === 0 ? 'active' : ''}">
        <button class="faq-question" type="button">
          <span>${item.question}</span>
          <span>+</span>
        </button>
        <div class="faq-answer">
          <p>${item.answer}</p>
        </div>
      </div>
    `).join('');

    faqRoot.querySelectorAll('.faq-question').forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.parentElement;
        item.classList.toggle('active');
      });
    });
  } catch (error) {
    faqRoot.innerHTML = '<p>Unable to load FAQs.</p>';
  }
};

const renderQuiz = async () => {
  const container = document.getElementById('quizApp');
  if (!container) return;

  try {
    trackActivity('quiz_start');
    const questions = await fetchJson('/api/quiz');
    let current = 0;
    let answers = {};

    const renderQuestion = () => {
      const q = questions[current];
      const answered = answers[current];
      const progress = ((current + 1) / questions.length) * 100;

      container.innerHTML = `
        <div class="progress"><div class="progress-bar" style="width: ${progress}%"></div></div>
        <div class="muted">Question ${current + 1} of ${questions.length}</div>
        <h2 style="margin:1rem 0;">${q.question}</h2>
        <div class="option-list">
          ${q.options.map((option, index) => `
            <label class="option-item">
              <input type="radio" name="question-${current}" value="${index}" ${answered === index ? 'checked' : ''}>
              <span>${option}</span>
            </label>
          `).join('')}
        </div>
        <div class="quiz-actions">
          <button class="btn btn-secondary" id="prevQuestion" ${current === 0 ? 'disabled' : ''}>Previous</button>
          <button class="btn btn-primary" id="nextQuestion">${current === questions.length - 1 ? 'Finish' : 'Next'}</button>
        </div>
      `;

      const radioInputs = container.querySelectorAll('input[type="radio"]');
      radioInputs.forEach((input) => {
        input.addEventListener('change', (event) => {
          answers[current] = Number(event.target.value);
        });
      });

      document.getElementById('prevQuestion')?.addEventListener('click', () => {
        if (current > 0) current -= 1; renderQuestion();
      });

      document.getElementById('nextQuestion')?.addEventListener('click', () => {
        const selected = answers[current];
        if (selected === undefined && current < questions.length) {
          showToast('Please choose an answer before continuing.');
          return;
        }

        if (current < questions.length - 1) {
          current += 1; renderQuestion();
          return;
        }

        const payload = { answers: Array.from({ length: questions.length }, (_, idx) => answers[idx] ?? null) };

        fetch('/api/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then((response) => response.json())
          .then((result) => {
            const resultBox = document.getElementById('quizResult');
            const feedback = questions.map((question, index) => {
              const correct = Number(payload.answers[index]) === Number(question.answer);
              return `<div class="quiz-feedback ${correct ? 'correct' : 'incorrect'}"><strong>${index + 1}. ${question.question}</strong> <span>${correct ? 'Correct' : 'Review'}</span><p>Your answer: ${question.options[payload.answers[index]] || 'Not answered'}${correct ? '' : `. Correct answer: ${question.options[question.answer]}`}</p></div>`;
            }).join('');
            resultBox.innerHTML = `
              <div class="quiz-score-banner"><strong>${result.score} / ${result.total}</strong><p>${result.message}</p></div>
              <div class="quiz-feedback-list">${feedback}</div>
              <div class="quiz-result-actions"><button class="btn btn-primary" id="retakeQuiz" type="button">Retake Quiz</button><a class="btn btn-secondary" href="/">Back to Home</a></div>
            `;
            resultBox.classList.add('visible');
            document.getElementById('quizApp').style.display = 'none';
            document.getElementById('retakeQuiz')?.addEventListener('click', () => window.location.reload());
          })
          .catch(() => showToast('Could not submit your quiz. Please try again.'));
      });
    };

    renderQuestion();
  } catch (error) {
    container.innerHTML = '<p>Unable to load quiz.</p>';
  }
};

const setupMobileMenu = () => {
  const topbarInner = document.querySelector('.topbar-inner');
  const nav = document.querySelector('.nav');
  if (!topbarInner || !nav) return;

  if (topbarInner.querySelector('.nav-toggle')) return;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Toggle navigation');
  toggle.innerHTML = '<span></span><span></span><span></span>';

  toggle.addEventListener('click', () => {
    const isOpen = topbarInner.classList.toggle('nav-open');
    nav.classList.toggle('nav-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  const navActions = topbarInner.querySelector('.nav-actions');
  if (navActions) {
    topbarInner.insertBefore(toggle, navActions);
  } else {
    topbarInner.appendChild(toggle);
  }
};

const bindLogoutButton = () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn || logoutBtn.dataset.bound === 'true') return;

  logoutBtn.dataset.bound = 'true';
  logoutBtn.addEventListener('click', async () => {
    const endpoint = window.location.pathname.includes('/admin') ? '/api/admin/logout' : '/api/auth/logout';
    const redirectPath = window.location.pathname.includes('/admin') ? '/admin' : '/';
    try {
      await fetchJson(endpoint, { method: 'POST' });
      window.location.href = redirectPath;
    } catch (error) {
      showToast(error.message);
    }
  });
};

const bindAuthForms = () => {
  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(adminLoginForm);
      const payload = {
        email: formData.get('email'),
        password: formData.get('password')
      };

      try {
        const result = await fetchJson('/api/admin/login', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        if (result.success) {
          window.location.href = '/admin/dashboard';
        }
      } catch (error) {
        showToast(error.message);
      }
    });
  }

  bindLogoutButton();
};

const bindSaveButtons = () => {
  document.querySelectorAll('[data-save-item]').forEach((button) => {
    const type = button.dataset.saveItem;
    const id = Number(button.dataset.itemId);
    const savedListKey = type === 'category' ? 'categories' : 'articles';

    fetch('/api/auth/me')
      .then((response) => response.json())
      .then((me) => {
        const savedItems = me?.user?.favorites?.[savedListKey] || [];
        const isSaved = savedItems.includes(id);
        button.classList.toggle('saved', isSaved);
        if (button.tagName === 'BUTTON') {
          button.textContent = isSaved ? 'Saved' : 'Save';
        }
      })
      .catch(() => undefined);

    button.addEventListener('click', async () => {
      try {
        const me = await fetchJson('/api/auth/me');
        if (!me.authenticated) {
          showToast('Please log in to save this item.');
          setTimeout(() => { window.location.href = '/login'; }, 900);
          return;
        }

        const payload = { type, id };
        const result = await fetchJson('/api/auth/favorites/toggle', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        const savedItems = result.favorites?.[savedListKey] || [];
        button.classList.toggle('saved', savedItems.includes(id));
        if (button.tagName === 'BUTTON') {
          button.textContent = savedItems.includes(id) ? 'Saved' : 'Save';
        }
        showToast(result.message);

        if (document.getElementById('savedTopics')) {
          renderAccountSummary();
        }
      } catch (error) {
        showToast(error.message || 'Unable to save this item.');
      }
    });
  });
};

const renderSavedTopics = (favorites = { articles: [], categories: [] }) => {
  const savedRoot = document.getElementById('savedTopics');
  if (!savedRoot) return;

  const articleIds = favorites.articles || [];
  const categoryIds = favorites.categories || [];

  if (!articleIds.length && !categoryIds.length) {
    savedRoot.innerHTML = '<div class="empty-state">No saved learning items yet. Save a category or article from the site to keep it here.</div>';
    return;
  }

  savedRoot.innerHTML = `
    <div class="saved-list">
      ${categoryIds.map((id) => `<div class="saved-item"><span class="saved-badge">Category</span><strong>Category #${id}</strong></div>`).join('')}
      ${articleIds.map((id) => `<div class="saved-item"><span class="saved-badge">Article</span><strong>Article #${id}</strong></div>`).join('')}
    </div>
  `;
};

const renderAccountSummary = async () => {
  const accountSummary = document.getElementById('accountSummary');
  if (!accountSummary) return;

  try {
    const result = await fetchJson('/api/auth/me');
    if (!result.authenticated) {
      window.location.href = '/login';
      return;
    }

    const favorites = result.user.favorites || { articles: [], categories: [] };
    accountSummary.innerHTML = `
      <div class="stat-box"><span>Member</span><strong>${result.user.name}</strong></div>
      <div class="stat-box"><span>Email</span><strong>${result.user.email}</strong></div>
      <div class="stat-box"><span>Saved topics</span><strong>${(favorites.articles || []).length + (favorites.categories || []).length}</strong></div>
      <div class="stat-box"><span>Quiz status</span><strong>Ready</strong></div>
    `;
    renderSavedTopics(favorites);
  } catch (error) {
    accountSummary.innerHTML = '<p>Unable to load your account details.</p>';
  }
};

const renderDashboard = async () => {
  const statsRoot = document.getElementById('dashboardStats');
  if (!statsRoot) return;

  try {
    const result = await fetchJson('/api/admin/overview');
    const stats = result.stats;
    const activityMetrics = [
      ['Page views', stats.pageViews], ['Article views', stats.articleViews],
      ['Category views', stats.categoryViews], ['Quiz starts', stats.quizStarts],
      ['Quiz completions', stats.quizCompletions], ['Quiz submissions', stats.quizSubmissions]
    ];
    const contentMetrics = [...(stats.articleViewsByContent || []), ...(stats.categoryViewsByContent || [])];
    const topicMetrics = [...(stats.categoryViewsByContent || []), ...(stats.articleViewsByContent || [])]
      .sort((a, b) => b.value - a.value).slice(0, 5);
    const maxActivity = Math.max(1, ...contentMetrics.map((item) => item.value));
    statsRoot.innerHTML = `
      <article class="report-card page-views-card">
        <h2>Content page views</h2>
        ${topicMetrics.length ? topicMetrics.map(({ label, value }) => `<div class="report-row"><span>${label}</span><div class="report-track"><i style="width:${Math.round((value / maxActivity) * 100)}%"></i></div><strong>${value}</strong></div>`).join('') : '<p class="report-empty">No content views recorded yet.</p>'}
      </article>
      <article class="report-card quiz-engagement-card">
        <h2>Quiz engagement</h2>
        <div class="quiz-report-stats">
          <div><strong>${stats.quizCompletions}</strong><span>Completions</span></div>
          <div><strong>${stats.avgScore}</strong><span>Avg. score / 8</span></div>
          <div><strong>${stats.quizStarts ? Math.round((stats.quizCompletions / stats.quizStarts) * 100) : 0}%</strong><span>Finish rate</span></div>
        </div>
        <p class="report-note">Engagement is based on anonymous visitor activity recorded by the site.</p>
      </article>
      <div class="report-summary">
        ${activityMetrics.map(([label, value]) => `<span>${label}<strong>${value}</strong></span>`).join('')}
      </div>
    `;
  } catch (error) {
    statsRoot.innerHTML = '<p>Unable to load dashboard stats.</p>';
  }
};

const renderAdminHome = async () => {
  const statsRoot = document.getElementById('adminHomeStats');
  const activityRoot = document.getElementById('recentActivity');
  if (!statsRoot || !activityRoot) return;
  try {
    const [overview, activityResult] = await Promise.all([
      fetchJson('/api/admin/overview'),
      fetchJson('/api/admin/activities')
    ]);
    const stats = overview.stats;
    statsRoot.innerHTML = [
      ['Published articles', stats.articles],
      ['Quiz questions', stats.quizQuestions],
      ['Content views', stats.pageViews + stats.articleViews + stats.categoryViews],
      ['Quiz completions', stats.quizCompletions]
    ].map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('');
    const recent = (activityResult.activities || []).slice(-4).reverse();
    activityRoot.innerHTML = recent.length
      ? `<div class="recent-head"><span>Action</span><span>Item</span><span>When</span></div>${recent.map((item) => `<div class="recent-row"><span>${item.type.replaceAll('_', ' ')}</span><span>${item.contentId || 'Visitor activity'}</span><span>${new Date(item.timestamp).toLocaleDateString()}</span></div>`).join('')}`
      : '<p class="report-empty">No visitor activity recorded yet.</p>';
  } catch (error) {
    statsRoot.innerHTML = '';
    activityRoot.innerHTML = '<p class="report-empty">Unable to load recent activity.</p>';
  }
};

const renderAdminArticlesTable = async () => {
  const root = document.getElementById('adminArticlesTable');
  if (!root) return;
  try {
    const data = await fetchJson('/api/admin/content');
    root.innerHTML = `<div class="admin-table-row admin-table-head"><span>Title</span><span>Category</span><span>Status</span><span>Updated</span><span>Actions</span></div>${data.articles.map((item) => `<div class="admin-table-row"><span>${item.title}</span><span>${item.category}</span><span><b class="status-pill">Published</b></span><span>Today</span><span><button type="button" data-delete-content="article" data-item-id="${item.id}">Delete</button></span></div>`).join('')}`;
    root.querySelectorAll('[data-delete-content]').forEach((button) => button.addEventListener('click', async () => {
      await fetchJson(`/api/admin/content/article/${button.dataset.itemId}`, { method: 'DELETE' });
      renderAdminArticlesTable(); renderAdminContentList(); renderDashboard(); renderAdminHome();
    }));
  } catch (error) {
    root.innerHTML = '<p class="report-empty">Unable to load articles.</p>';
  }
};

const renderAdminCategories = async () => {
  const root = document.getElementById('adminCategoriesList');
  if (!root) return;
  try {
    const data = await fetchJson('/api/admin/content');
    root.innerHTML = data.categories.map((item) => `<div class="admin-table-row"><span>${item.name}</span><span>${item.description}</span><span>${item.highlights?.length || 0} topics</span></div>`).join('');
  } catch (error) {
    root.innerHTML = '<p class="report-empty">Unable to load categories.</p>';
  }
};

const setAdminView = () => {
  const view = window.location.hash.replace('#', '') || 'dashboard-home';
  document.querySelectorAll('.admin-view, .admin-home').forEach((section) => section.classList.toggle('is-visible', section.id === view));
  const titles = { 'dashboard-home': 'Dashboard', 'content-management': 'Content Management', 'categories-management': 'Categories', 'quiz-questions': 'Quiz Questions', 'usage-reports': 'Usage Reports' };
  const title = document.getElementById('adminPageTitle');
  if (title) title.textContent = titles[view] || 'Dashboard';
  document.querySelectorAll('.admin-nav a').forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${view}`));
};

const renderAdminContentList = async () => {
  const root = document.getElementById('adminContentList');
  if (!root) return;

  try {
    const data = await fetchJson('/api/admin/content');
    const entries = [
      ...data.categories.map((item) => ({ ...item, kind: 'Category' })),
      ...data.articles.map((item) => ({ ...item, kind: 'Article' })),
      ...data.faqs.map((item) => ({ ...item, kind: 'FAQ' }))
    ];

    root.innerHTML = entries.map((item, index) => {
      const id = item.id ?? (index + 1) * 1000;
      return `
        <div class="list-item list-item-compact">
          <div class="list-icon">${item.icon || (item.kind === 'Article' ? '📘' : item.kind === 'FAQ' ? '❓' : '📂')}</div>
          <div>
            <h4>${item.name || item.title || item.question || 'Content item'}</h4>
            <p>${item.description || item.summary || item.answer || 'Content library item.'}</p>
          </div>
          <button class="btn btn-ghost btn-small" type="button" data-delete-content="${item.kind.toLowerCase()}" data-item-id="${id}">Delete</button>
        </div>
      `;
    }).join('');

    root.querySelectorAll('[data-delete-content]').forEach((button) => {
      button.addEventListener('click', async () => {
        try {
          const section = button.dataset.deleteContent;
          const id = button.dataset.itemId;
          await fetchJson(`/api/admin/content/${section}/${id}`, { method: 'DELETE' });
          showToast('Content deleted.');
          renderAdminContentList();
          renderDashboard();
        } catch (error) {
          showToast(error.message || 'Unable to delete content.');
        }
      });
    });
  } catch (error) {
    root.innerHTML = '<p>Unable to load content library.</p>';
  }
};

const bindAdminContentForms = () => {
  document.querySelectorAll('[data-admin-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = {
        section: form.dataset.adminForm,
        ...Object.fromEntries(new FormData(form).entries())
      };

      if (payload.highlights && typeof payload.highlights === 'string') {
        payload.highlights = payload.highlights.split(',').map((item) => item.trim()).filter(Boolean);
      }

      try {
        await fetchJson('/api/admin/content', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        form.reset();
        renderAdminContentList();
        renderDashboard();
        showToast('Content saved successfully.');
      } catch (error) {
        showToast(error.message || 'Unable to save content.');
      }
    });
  });
};

const handleSearch = async () => {
  const searchInput = document.getElementById('siteSearch');
  const listRoot = document.getElementById('searchResults');
  if (!searchInput || !listRoot) return;

  const runSearch = async () => {
    const value = searchInput.value.trim();
    try {
      const result = await fetchJson(`/api/search?q=${encodeURIComponent(value)}`);
      const items = [...(result.categories || []), ...(result.articles || [])];
      listRoot.innerHTML = items.length
        ? items.map((item) => `
            <div class="list-item">
              <div class="list-icon">${item.icon || '📘'}</div>
              <div>
                <h4>${item.name || item.title}</h4>
                <p>${item.description || item.summary}</p>
              </div>
            </div>
          `).join('')
        : '<div class="content-panel"><p>No results match your search yet.</p></div>';
    } catch (error) {
      listRoot.innerHTML = '<div class="content-panel"><p>Search is temporarily unavailable.</p></div>';
    }
  };

  searchInput.addEventListener('input', runSearch);
};

document.addEventListener('DOMContentLoaded', () => {
  trackActivity('page_view');
  setupMobileMenu();
  renderSiteCards();
  renderCategoriesPage();
  renderArticlesPage();
  renderArticleDetail();
  renderFaqs();
  renderQuiz();
  bindAuthForms();
  bindAdminContentForms();
  renderAccountSummary();
  renderDashboard();
  renderAdminHome();
  renderAdminArticlesTable();
  renderAdminCategories();
  renderAdminContentList();
  window.addEventListener('hashchange', setAdminView);
  setAdminView();
  handleSearch();
});
