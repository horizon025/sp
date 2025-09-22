console.log('🌅 Horizon Script Loading...');

// Global Variables
let currentCategory = 'Home';
let isDarkMode = false;

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM Loaded - Initializing...');
  initializeApp();
  setupEventListeners();
  showCategory('Home');
  console.log('🚀 Horizon Fully Initialized!');
});

// Initialize App
function initializeApp() {
  loadPreferences();
  updateActiveNavigation();
  console.log('📱 App Initialized Successfully');
}

// Setup Event Listeners
function setupEventListeners() {
  console.log('🔗 Setting up event listeners...');

  // Mobile Menu Toggle
  document.getElementById('mobileMenuBtn').addEventListener('click', toggleSidebar);
  document.querySelector('.sidebar-close-btn').addEventListener('click', toggleSidebar);

  // Sidebar Menu Items
  document.querySelectorAll('.slide').forEach(slide => {
    if (slide.dataset.toggle) {
      slide.addEventListener('click', (e) => {
        if (slide.dataset.toggle === 'study') toggleStudy(e);
        if (slide.dataset.toggle === 'workshop') toggleWorkshop(e);
      });
    } else {
      slide.addEventListener('click', () => showCategory(slide.dataset.category));
    }
  });

  // Category Tabs
  document.querySelectorAll('.blue-section span').forEach(tab => {
    tab.addEventListener('click', () => showCategory(tab.dataset.category));
  });

  // Theme Toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Settings
  document.getElementById('settingsBtn').addEventListener('click', openSettings);
  document.querySelector('#settingsModal .close-btn').addEventListener('click', closeSettings);
  document.querySelector('.settings-section button').addEventListener('click', handleLogin);
  document.getElementById('themeSelect').addEventListener('change', (e) => setTheme(e.target.value));
  document.getElementById('languageSelect').addEventListener('change', (e) => translateInterface(e.target.value));

  // Comments
  document.querySelector('#commentsModal .close-btn').addEventListener('click', closeComments);
  document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const comment = DOMPurify.sanitize(e.target.querySelector('textarea').value);
    if (comment) {
      const commentsList = document.getElementById('comments-list');
      const commentEl = document.createElement('div');
      commentEl.textContent = comment;
      commentsList.appendChild(commentEl);
      await submitComment(currentCategory, comment); // API call
      e.target.reset();
    }
  });

  // Newsletter
  document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = DOMPurify.sanitize(e.target.querySelector('input').value);
    if (email) {
      console.log(`📧 Subscribed: ${email}`);
      alert('Thank you for subscribing!');
      e.target.reset();
    }
  });

  // Search
  document.getElementById('searchBar').addEventListener('input', searchPosts);

  // Load More
  document.querySelector('.load-more-btn').addEventListener('click', loadMorePosts);

  // Infinite Scroll
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      loadMorePosts();
    }
  });

  // Outside Click to Close Sidebar
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 768) {
      const sidebar = document.getElementById('sidebar');
      const mobileBtn = document.getElementById('mobileMenuBtn');
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !mobileBtn.contains(e.target)) {
        toggleSidebar();
      }
    }
  });

  // Keyboard Support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSettings();
      closeComments();
      if (document.getElementById('sidebar').classList.contains('open')) {
        toggleSidebar();
      }
    }
  });

  console.log('✅ All event listeners attached successfully!');
}

// Toggle Sidebar
function toggleSidebar() {
  console.log('☰ Sidebar toggle clicked');
  const sidebar = document.getElementById('sidebar');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mainContent = document.getElementById('mainContent');
  sidebar.classList.toggle('open');
  mobileBtn.classList.toggle('active');
  mainContent.classList.toggle('shifted');
  console.log(`📱 Sidebar ${sidebar.classList.contains('open') ? 'opened' : 'closed'}`);
}

// Show Category
function showCategory(category) {
  console.log(`🌐 Loading category: ${category}`);
  if (window.innerWidth < 768) toggleSidebar();
  currentCategory = category;
  document.getElementById('page-title').textContent = `${category} - Latest Updates`;
  updateActiveNavigation(category);
  loadCategoryContent(category);
  closeComments();
  closeSettings();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  console.log(`✅ ${category} loaded successfully`);
}

// Update Active Navigation
function updateActiveNavigation(category) {
  document.querySelectorAll('.slide').forEach(slide => slide.classList.remove('active'));
  const activeSlide = document.querySelector(`[data-category="${category}"]`);
  if (activeSlide) activeSlide.classList.add('active');
  console.log(`🎯 Active nav updated: ${category}`);
}

// Load Category Content
async function loadCategoryContent(category) {
  const container = document.getElementById('recent-posts');
  container.innerHTML = '<div class="loading">Loading...</div>';
  
  setTimeout(async () => {
    const posts = await fetchPosts(category); // Use API
    container.innerHTML = '';
    posts.forEach(post => container.appendChild(createPostCard(post)));
    document.getElementById('load-more').classList.remove('hidden');
    console.log(`📄 Loaded ${posts.length} posts for ${category}`);
  }, 800);
}

// Create Post Card
function createPostCard(post) {
  const card = document.createElement('div');
  card.className = 'post-card';
  card.innerHTML = `
    <img src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.src='/images/fallback.jpg'">
    <h3>${post.title}</h3>
    <p>${post.description}</p>
    <div class="post-meta">
      <span class="category-tag">${post.category}</span>
      <span class="date">${post.date}</span>
    </div>
    <div class="post-actions">
      <button class="like-btn">❤️ ${Math.floor(Math.random() * 100)}</button>
      <button class="share-btn">📤 Share</button>
      <button class="comment-btn">💬 Comment</button>
    </div>
  `;
  
  card.querySelector('.like-btn').addEventListener('click', (e) => likePost(e.target));
  card.querySelector('.share-btn').addEventListener('click', () => sharePost(post.title));
  card.querySelector('.comment-btn').addEventListener('click', () => openComments(post.title));
  
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.like-btn, .share-btn, .comment-btn')) {
      console.log('📰 Full post clicked');
    }
  });
  
  return card;
}

// Study Toggle
function toggleStudy(e) {
  e.stopPropagation();
  console.log('📚 Study menu toggled');
  const studyGroup = document.getElementById('studyGroup');
  const expandIcon = e.currentTarget.querySelector('.expand-icon');
  studyGroup.classList.toggle('hidden');
  expandIcon.classList.toggle('rotated');
  const workshopGroup = document.getElementById('workshopGroup');
  if (workshopGroup && !workshopGroup.classList.contains('hidden')) {
    const workshopIcon = document.querySelector('[data-toggle="workshop"] .expand-icon');
    if (workshopIcon) workshopIcon.classList.remove('rotated');
    workshopGroup.classList.add('hidden');
  }
}

// Workshop Toggle
function toggleWorkshop(e) {
  e.stopPropagation();
  console.log('🔧 Workshop menu toggled');
  const workshopGroup = document.getElementById('workshopGroup');
  const expandIcon = e.currentTarget.querySelector('.expand-icon');
  workshopGroup.classList.toggle('hidden');
  expandIcon.classList.toggle('rotated');
  const studyGroup = document.getElementById('studyGroup');
  if (studyGroup && !studyGroup.classList.contains('hidden')) {
    const studyIcon = document.querySelector('[data-toggle="study"] .expand-icon');
    if (studyIcon) studyIcon.classList.remove('rotated');
    studyGroup.classList.add('hidden');
  }
}

// Theme Toggle
function toggleTheme() {
  console.log('🌙 Theme toggle clicked');
  isDarkMode = !isDarkMode;
  setTheme(isDarkMode ? 'dark' : 'light');
}

function setTheme(theme) {
  isDarkMode = theme === 'dark';
  document.body.classList.toggle('dark-theme', isDarkMode);
  document.getElementById('themeToggle').textContent = isDarkMode ? '☀️ Light' : '🌙 Dark';
  document.getElementById('themeSelect').value = theme;
  localStorage.setItem('theme', theme);
  console.log(`🎨 Theme changed to: ${theme}`);
}

// Settings Functions
function openSettings() {
  console.log('⚙️ Settings opened');
  document.getElementById('settingsModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeSettings() {
  console.log('⚙️ Settings closed');
  document.getElementById('settingsModal').classList.remove('show');
  document.body.style.overflow = 'auto';
}

function handleLogin() {
  const username = DOMPurify.sanitize(document.getElementById('loginUsername').value.trim());
  const password = DOMPurify.sanitize(document.getElementById('loginPassword').value);
  if (username && password) {
    console.log(`👤 Login successful: ${username}`);
    alert(`Welcome back, ${username}!`);
    document.getElementById('loginBtn').textContent = `Hi ${username}`;
    closeSettings();
  } else {
    console.log('❌ Login failed');
    alert('Please enter username and password');
  }
}

// Comments Functions
function openComments(title) {
  console.log(`💬 Opening comments for: ${title}`);
  document.getElementById('comment-title').textContent = `${title} - Comments`;
  document.getElementById('commentsModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeComments() {
  console.log('💬 Closing comments');
  document.getElementById('commentsModal').classList.remove('show');
  document.body.style.overflow = 'auto';
}

// Load More Posts
function loadMorePosts() {
  console.log('📄 Loading more posts...');
  const btn = document.querySelector('.load-more-btn');
  const originalText = btn.textContent;
  btn.textContent = 'Loading...';
  btn.disabled = true;
  
  setTimeout(async () => {
    const container = document.getElementById('recent-posts');
    const newPosts = await fetchPosts(currentCategory, 3);
    newPosts.forEach(post => container.appendChild(createPostCard(post)));
    btn.textContent = originalText;
    btn.disabled = false;
    console.log(`➕ Added ${newPosts.length} more posts`);
  }, 1500);
}

// Utility Functions
function likePost(btn) {
  const likes = parseInt(btn.textContent.match(/\d+/)[0]) + 1;
  btn.textContent = `❤️ ${likes}`;
  btn.style.background = '#ff6b6b';
  setTimeout(() => { btn.style.background = '#f8f9fa'; }, 200);
}

function sharePost(title) {
  console.log(`📤 Sharing: ${title}`);
  if (navigator.share) {
    navigator.share({
      title: `Horizon News: ${title}`,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(`${title} - ${window.location.href}`);
    alert('Link copied to clipboard!');
  }
}

// Load Preferences
function loadPreferences() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  
  const savedLang = localStorage.getItem('language') || 'en';
  translateInterface(savedLang);
  document.getElementById('languageSelect').value = savedLang;
}

// Search Function
function searchPosts() {
  console.log('🔍 Searching...');
  const query = DOMPurify.sanitize(document.getElementById('searchBar').value.toLowerCase().trim());
  const posts = document.querySelectorAll('.post-card');
  let visibleCount = 0;
  
  posts.forEach(post => {
    const text = post.textContent.toLowerCase();
    const isVisible = text.includes(query);
    post.style.display = isVisible ? 'block' : 'none';
    if (isVisible) {
      post.style.border = '2px solid #ff6b6b';
      visibleCount++;
      setTimeout(() => { post.style.border = ''; }, 1000);
    }
  });
  
  console.log(`🔍 Found ${visibleCount} results for "${query}"`);
  document.getElementById('load-more').classList.toggle('hidden', query !== '');
}

// Translate Interface
function translateInterface(lang) {
  console.log(`🌐 Language changed to: ${lang}`);
  const translations = {
    en: {
      'Home': 'Home', 'News': 'News', 'Study': 'Study', 'Workshop': 'Workshop',
      '10thBoardHindi': '10th Board Hindi', '10thBoardEnglish': '10th Board English',
      '12thBoardHindi': '12th Board Hindi', '12thBoardEnglish': '12th Board English',
      'CompetitiveHindi': 'Competitive Hindi', 'CompetitiveEnglish': 'Competitive English',
      'Cafe': 'Cafe', 'WebsiteBuilder': 'Website Builder', 'Editor': 'Editor',
      'Designer': 'Designer', 'ContentCreator': 'Content Creator', 'Affiliate': 'Affiliate',
      'Dropshipping': 'Dropshipping', 'Promotion': 'Promotion', 'Tech': 'Tech',
      'Bollywood': 'Bollywood', 'Sports': 'Sports', 'Stocks': 'Stocks',
      'Entertainment': 'Entertainment', 'Extra': 'Extra', 'Contact': 'Contact',
      'Trending': 'Trending', 'Videos': 'Videos', 'Politics': 'Politics', 'Health': 'Health',
      'Search news...': 'Search news...', 'Latest News': 'Latest News', 'Load More': 'Load More'
    },
    hi: {
      'Home': 'होम', 'News': 'समाचार', 'Study': 'अध्ययन', 'Workshop': 'कार्यशाला',
      '10thBoardHindi': '10वीं हिंदी', '10thBoardEnglish': '10वीं अंग्रेजी',
      '12thBoardHindi': '12वीं हिंदी', '12thBoardEnglish': '12वीं अंग्रेजी',
      'CompetitiveHindi': 'प्रतियोगी हिंदी', 'CompetitiveEnglish': 'प्रतियोगी अंग्रेजी',
      'Cafe': 'कैफे', 'WebsiteBuilder': 'वेबसाइट बिल्डर', 'Editor': 'एडिटर',
      'Designer': 'डिजाइनर', 'ContentCreator': 'कंटेंट क्रिएटर', 'Affiliate': 'एफिलिएट',
      'Dropshipping': 'ड्रॉपशिपिंग', 'Promotion': 'प्रमोशन', 'Tech': 'तकनीक',
      'Bollywood': 'बॉलीवुड', 'Sports': 'खेल', 'Stocks': 'शेयर',
      'Entertainment': 'मनोरंजन', 'Extra': 'अतिरिक्त', 'Contact': 'संपर्क',
      'Trending': 'ट्रेंडिंग', 'Videos': 'वीडियो', 'Politics': 'राजनीति', 'Health': 'स्वास्थ्य',
      'Search news...': 'समाचार खोजें...', 'Latest News': 'नवीनतम समाचार', 'Load More': 'और लोड करें'
    }
  };
  
  const currentLang = translations[lang] || translations.en;
  document.querySelectorAll('.nav-text').forEach(el => {
    const key = Object.keys(translations.en).find(k => translations.en[k] === el.textContent.trim() || el.dataset.original === k);
    if (currentLang[key]) {
      el.textContent = currentLang[key];
      el.dataset.original = key; // Store original key for future translations
    }
  });
  
  document.querySelectorAll('.blue-section span').forEach(el => {
    const key = Object.keys(translations.en).find(k => translations.en[k] === el.textContent.trim() || el.dataset.original === k);
    if (currentLang[key]) {
      el.textContent = currentLang[key];
      el.dataset.original = key;
    }
  });
  
  document.getElementById('searchBar').placeholder = currentLang['Search news...'];
  document.querySelector('.post-section h2').textContent = currentLang['Latest News'];
  document.querySelector('.load-more-btn').textContent = currentLang['Load More'];
  
  localStorage.setItem('language', lang);
  console.log(`✅ Language updated to: ${lang}`);
}

// Error Handling
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error);
  alert('कुछ गलत हो गया। पेज रिफ्रेश करें।');
});

// Offline Detection
window.addEventListener('online', () => console.log('🌐 Online'));
window.addEventListener('offline', () => {
  console.log('📴 Offline');
  alert('इंटरनेट कनेक्शन खो गया।');
});
