// Horizon - COMPLETE WORKING JavaScript
console.log('🌅 Horizon Script Loading...');

// Global Variables
let currentCategory = 'Home';
let isDarkMode = false;

// DOM Ready - यह सबसे important है!
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ DOM Loaded - Initializing...');
  
  // Initialize everything
  initializeApp();
  setupEventListeners();
  
  // Load initial content
  showCategory('Home');
  
  console.log('🚀 Horizon Fully Initialized!');
});

// Initialize App
function initializeApp() {
  // Load saved preferences
  loadPreferences();
  
  // Set initial active states
  updateActiveNavigation();
  
  console.log('📱 App Initialized Successfully');
}

// Setup ALL Event Listeners
function setupEventListeners() {
  console.log('🔗 Setting up event listeners...');
  
  // 1. Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', toggleSidebar);
    console.log('☰ Mobile menu listener added');
  }
  
  // 2. Sidebar Close Button
  const closeBtn = document.querySelector('.sidebar-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', toggleSidebar);
    console.log('× Close button listener added');
  }
  
  // 3. ALL Sidebar Menu Items - यह सबसे important है!
  const allSlides = document.querySelectorAll('.slide');
  allSlides.forEach(slide => {
    // Remove old onclick attributes
    slide.removeAttribute('onclick');
    
    // Add new event listener
    slide.addEventListener('click', function(e) {
      const category = this.getAttribute('data-category') || 'Home';
      console.log(`📂 Category clicked: ${category}`);
      showCategory(category);
    });
    
    // Set data-category attribute
    const category = slide.textContent.trim().toLowerCase().replace(/\s+/g, '');
    slide.setAttribute('data-category', category);
  });
  
  console.log(`📋 Added listeners to ${allSlides.length} menu items`);
  
  // 4. Study Toggle
  const studyBtn = document.querySelector('.slide[onclick*="toggleStudy"]') || 
                   document.querySelector('.nav-text:contains("Study")').closest('.slide');
  if (studyBtn) {
    studyBtn.removeAttribute('onclick');
    studyBtn.addEventListener('click', toggleStudy);
    console.log('📚 Study toggle listener added');
  }
  
  // 5. Workshop Toggle
  const workshopBtn = document.querySelector('.slide[onclick*="toggleWorkshop"]') || 
                      document.querySelector('.nav-text:contains("Workshop")').closest('.slide');
  if (workshopBtn) {
    workshopBtn.removeAttribute('onclick');
    workshopBtn.addEventListener('click', toggleWorkshop);
    console.log('🔧 Workshop toggle listener added');
  }
  
  // 6. Category Tabs (Top)
  const tabSpans = document.querySelectorAll('.blue-section span');
  tabSpans.forEach(tab => {
    tab.removeAttribute('onclick');
    tab.addEventListener('click', function() {
      const category = this.textContent.trim();
      console.log(`📂 Tab clicked: ${category}`);
      showCategory(category);
    });
  });
  
  // 7. Theme Toggle
  const themeBtn = document.querySelector('.toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
  
  // 8. Settings
  const settingsBtn = document.querySelector('[onclick*="openSettings"]') || 
                      document.querySelector('.toggle-btn:last-child');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', openSettings);
  }
  
  // 9. Outside Click to Close Sidebar
  document.addEventListener('click', function(e) {
    if (window.innerWidth < 768) {
      const sidebar = document.getElementById('sidebar');
      const mobileBtn = document.getElementById('mobileMenuBtn');
      
      if (sidebar.classList.contains('open') && 
          !sidebar.contains(e.target) && 
          !mobileBtn.contains(e.target)) {
        toggleSidebar();
      }
    }
  });
  
  // 10. Keyboard Support
  document.addEventListener('keydown', function(e) {
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

// Toggle Sidebar - मुख्य function
function toggleSidebar() {
  console.log('☰ Sidebar toggle clicked');
  
  const sidebar = document.getElementById('sidebar');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mainContent = document.getElementById('mainContent');
  
  if (!sidebar || !mobileBtn || !mainContent) {
    console.error('❌ Sidebar elements not found');
    return;
  }
  
  sidebar.classList.toggle('open');
  mobileBtn.classList.toggle('active');
  mainContent.classList.toggle('shifted');
  
  console.log(`📱 Sidebar ${sidebar.classList.contains('open') ? 'opened' : 'closed'}`);
}

// Show Category - मुख्य content load function
function showCategory(category) {
  console.log(`🌐 Loading category: ${category}`);
  
  // Close sidebar on mobile
  if (window.innerWidth < 768) {
    toggleSidebar();
  }
  
  currentCategory = category;
  
  // Update page title
  const titleElement = document.getElementById('page-title');
  if (titleElement) {
    titleElement.textContent = `${category} - Latest Updates`;
  }
  
  // Update active navigation
  updateActiveNavigation(category);
  
  // Load content
  loadCategoryContent(category);
  
  // Close modals
  closeComments();
  closeSettings();
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  console.log(`✅ ${category} loaded successfully`);
}

// Update Active Navigation
function updateActiveNavigation(category) {
  // Remove active from all
  document.querySelectorAll('.slide').forEach(slide => {
    slide.classList.remove('active');
  });
  
  // Add active to current
  const activeSlide = document.querySelector(`[data-category*="${category.toLowerCase()}"]`);
  if (activeSlide) {
    activeSlide.classList.add('active');
    console.log(`🎯 Active nav updated: ${category}`);
  }
}

// Load Category Content
function loadCategoryContent(category) {
  const container = document.getElementById('recent-posts');
  if (!container) {
    console.error('❌ Posts container not found');
    return;
  }
  
  // Show loading
  container.innerHTML = '<div class="loading">Loading...</div>';
  
  // Simulate API delay
  setTimeout(() => {
    // Generate posts
    const posts = generatePosts(category, 6);
    
    // Clear loading
    container.innerHTML = '';
    
    // Render posts
    posts.forEach(post => {
      const postCard = createPostCard(post);
      container.appendChild(postCard);
    });
    
    // Show load more
    document.getElementById('load-more').classList.remove('hidden');
    
    console.log(`📄 Loaded ${posts.length} posts for ${category}`);
  }, 800);
}

// Generate Sample Posts
function generatePosts(category, count) {
  const categories = {
    'Home': ['Breaking News', 'Top Stories', 'Featured', 'Popular'],
    'News': ['India News', 'World News', 'Politics', 'Economy'],
    'Tech': ['Gadgets', 'AI', 'Software', 'Startups'],
    'Sports': ['Cricket', 'Football', 'Tennis', 'Analysis'],
    'Bollywood': ['Movies', 'Celebrities', 'Reviews', 'Gossip'],
    'Health': ['Fitness', 'Diet', 'Medical', 'Wellness']
  };
  
  const catTitles = categories[category] || ['News', 'Updates', 'Stories'];
  const posts = [];
  
  for (let i = 0; i < count; i++) {
    posts.push({
      title: `${catTitles[i % catTitles.length]} ${i + 1}`,
      description: `Latest updates about ${category.toLowerCase()} - comprehensive coverage and analysis.`,
      image: `https://picsum.photos/400/250?random=${i}`,
      category: category,
      date: new Date(Date.now() - Math.random() * 86400000 * 7).toLocaleDateString()
    });
  }
  
  return posts;
}

// Create Post Card
function createPostCard(post) {
  const card = document.createElement('div');
  card.className = 'post-card';
  card.innerHTML = `
    <img src="${post.image}" alt="${post.title}" loading="lazy">
    <h3>${post.title}</h3>
    <p>${post.description}</p>
    <div class="post-meta">
      <span class="category-tag">${post.category}</span>
      <span class="date">${post.date}</span>
    </div>
    <div class="post-actions">
      <button onclick="likePost(this)" class="like-btn">❤️ ${Math.floor(Math.random() * 100)}</button>
      <button onclick="sharePost('${post.title}')" class="share-btn">📤 Share</button>
      <button onclick="openComments('${post.title}')" class="comment-btn">💬 Comment</button>
    </div>
  `;
  
  // Add click handler for full post
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.like-btn, .share-btn, .comment-btn')) {
      console.log('📰 Full post clicked');
      // Open full article modal
    }
  });
  
  return card;
}

// Study Toggle
function toggleStudy(e) {
  e.stopPropagation(); // Prevent category load
  console.log('📚 Study menu toggled');
  
  const studyGroup = document.getElementById('studyGroup');
  const expandIcon = e.currentTarget.querySelector('.expand-icon');
  
  if (studyGroup && expandIcon) {
    studyGroup.classList.toggle('hidden');
    expandIcon.classList.toggle('rotated');
    
    // Close workshop if open
    const workshopGroup = document.getElementById('workshopGroup');
    if (workshopGroup && !workshopGroup.classList.contains('hidden')) {
      const workshopIcon = document.querySelector('.workshop-group + .expand-icon');
      if (workshopIcon) workshopIcon.classList.remove('rotated');
      workshopGroup.classList.add('hidden');
    }
  }
}

// Workshop Toggle
function toggleWorkshop(e) {
  e.stopPropagation(); // Prevent category load
  console.log('🔧 Workshop menu toggled');
  
  const workshopGroup = document.getElementById('workshopGroup');
  const expandIcon = e.currentTarget.querySelector('.expand-icon');
  
  if (workshopGroup && expandIcon) {
    workshopGroup.classList.toggle('hidden');
    expandIcon.classList.toggle('rotated');
    
    // Close study if open
    const studyGroup = document.getElementById('studyGroup');
    if (studyGroup && !studyGroup.classList.contains('hidden')) {
      const studyIcon = document.querySelector('.study-group + .expand-icon');
      if (studyIcon) studyIcon.classList.remove('rotated');
      studyGroup.classList.add('hidden');
    }
  }
}

// Theme Toggle
function toggleTheme() {
  console.log('🌙 Theme toggle clicked');
  
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-theme', isDarkMode);
  
  const btn = event.target;
  btn.textContent = isDarkMode ? '☀️ Light' : '🌙 Dark';
  
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  console.log(`🎨 Theme changed to: ${isDarkMode ? 'Dark' : 'Light'}`);
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
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  
  if (username && password) {
    console.log(`👤 Login successful: ${username}`);
    alert(`Welcome back, ${username}!`);
    closeSettings();
    // Update UI
    document.querySelector('.login-btn').textContent = `Hi ${username}`;
  } else {
    console.log('❌ Login failed');
    alert('Please enter username and password');
  }
}

// Comments Functions
function openComments(title) {
  console.log(`💬 Opening comments for: ${title}`);
  document.getElementById('comment-title').textContent = `${title} - Comments`;
  document.getElementById('commentsModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeComments() {
  console.log('💬 Closing comments');
  document.getElementById('commentsModal').classList.add('hidden');
  document.body.style.overflow = 'auto';
}

// Load More Posts
function loadMorePosts() {
  console.log('📄 Loading more posts...');
  
  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = 'Loading...';
  btn.disabled = true;
  
  setTimeout(() => {
    // Add 3 more posts
    const container = document.getElementById('recent-posts');
    const newPosts = generatePosts(currentCategory, 3);
    
    newPosts.forEach(post => {
      const postCard = createPostCard(post);
      container.appendChild(postCard);
    });
    
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
    // Fallback
    navigator.clipboard.writeText(`${title} - ${window.location.href}`);
    alert('Link copied to clipboard!');
  }
}

// Load Preferences
function loadPreferences() {
  // Theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDarkMode = true;
    document.body.classList.add('dark-theme');
    document.querySelector('.toggle-btn').textContent = '☀️ Light';
  }
  
  // Language
  const savedLang = localStorage.getItem('language') || 'en';
  translateInterface(savedLang);
}

// Search Function
function searchPosts() {
  console.log('🔍 Searching...');
  
  const query = document.getElementById('searchBar').value.toLowerCase().trim();
  const posts = document.querySelectorAll('.post-card');
  let visibleCount = 0;
  
  posts.forEach(post => {
    const text = post.textContent.toLowerCase();
    const isVisible = text.includes(query);
    
    if (isVisible) {
      post.style.display = 'block';
      post.style.border = '2px solid #ff6b6b';
      visibleCount++;
      
      // Remove highlight after 1s
      setTimeout(() => {
        post.style.border = '';
      }, 1000);
    } else {
      post.style.display = 'none';
    }
  });
  
  console.log(`🔍 Found ${visibleCount} results for "${query}"`);
  
  if (query === '') {
    document.getElementById('load-more').classList.remove('hidden');
  } else {
    document.getElementById('load-more').classList.add('hidden');
  }
}

// Translate Interface
function translateInterface(lang) {
  console.log(`🌐 Language changed to: ${lang}`);
  
  const translations = {
    en: {
      'Home': 'Home', 'News': 'News', 'Study': 'Study', 'Workshop': 'Workshop',
      '10th Board Hindi': '10th Board Hindi', '10th Board English': '10th Board English',
      '12th Board Hindi': '12th Board Hindi', '12th Board English': '12th Board English',
      'Competitive Hindi': 'Competitive Hindi', 'Competitive English': 'Competitive English',
      'Cafe': 'Cafe', 'Website Builder': 'Website Builder', 'Editor': 'Editor',
      'Designer': 'Designer', 'Content Creator': 'Content Creator', 'Affiliate': 'Affiliate',
      'Dropshipping': 'Dropshipping', 'Promotion': 'Promotion', 'Tech': 'Tech',
      'Bollywood': 'Bollywood', 'Sports': 'Sports', 'Stocks': 'Stocks',
      'Entertainment': 'Entertainment', 'Extra': 'Extra', 'Contact': 'Contact',
      'Trending': 'Trending', 'Videos': 'Videos', 'Politics': 'Politics', 'Health': 'Health',
      'Search news...': 'Search news...', 'Latest News': 'Latest News', 'Load More': 'Load More'
    },
    hi: {
      'Home': 'होम', 'News': 'समाचार', 'Study': 'अध्ययन', 'Workshop': 'कार्यशाला',
      '10th Board Hindi': '10वीं हिंदी', '10th Board English': '10वीं अंग्रेजी',
      '12th Board Hindi': '12वीं हिंदी', '12th Board English': '12वीं अंग्रेजी',
      'Competitive Hindi': 'प्रतियोगी हिंदी', 'Competitive English': 'प्रतियोगी अंग्रेजी',
      'Cafe': 'कैफे', 'Website Builder': 'वेबसाइट बिल्डर', 'Editor': 'एडिटर',
      'Designer': 'डिजाइनर', 'Content Creator': 'कंटेंट क्रिएटर', 'Affiliate': 'एफिलिएट',
      'Dropshipping': 'ड्रॉपशिपिंग', 'Promotion': 'प्रमोशन', 'Tech': 'तकनीक',
      'Bollywood': 'बॉलीवुड', 'Sports': 'खेल', 'Stocks': 'शेयर',
      'Entertainment': 'मनोरंजन', 'Extra': 'अतिरिक्त', 'Contact': 'संपर्क',
      'Trending': 'ट्रेंडिंग', 'Videos': 'वीडियो', 'Politics': 'राजनीति', 'Health': 'स्वास्थ्य',
      'Search news...': 'समाचार खोजें...', 'Latest News': 'नवीनतम समाचार', 'Load More': 'और लोड करें'
    }
  };
  
  const currentLang = translations[lang] || translations.en;
  
  // Update all text
  document.querySelectorAll('.nav-text').forEach(el => {
    const key = el.textContent.trim();
    if (currentLang[key]) {
      el.textContent = currentLang[key];
    }
  });
  
  // Update placeholders
  document.getElementById('searchBar').placeholder = currentLang['Search news...'] || 'Search news...';
  document.querySelector('.post-section h2').textContent = currentLang['Latest News'] || 'Latest News';
  
  localStorage.setItem('language', lang);
  console.log(`✅ Language updated to: ${lang}`);
}

// Error Handling
window.addEventListener('error', function(e) {
  console.error('JavaScript Error:', e.error);
  alert('कुछ गलत हो गया। पेज रिफ्रेश करें।');
});

// Offline Detection
window.addEventListener('online', () => {
  console.log('🌐 Online');
});

window.addEventListener('offline', () => {
  console.log('📴 Offline');
  alert('इंटरनेट कनेक्शन खो गया।');
});

// Export Functions (for onclick attributes if needed)
window.showCategory = showCategory;
window.toggleStudy = toggleStudy;
window.toggleWorkshop = toggleWorkshop;
window.toggleSidebar = toggleSidebar;
window.toggleTheme = toggleTheme;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.openComments = openComments;
window.closeComments = closeComments;
window.loadMorePosts = loadMorePosts;
window.handleLogin = handleLogin;
window.searchPosts = searchPosts;
window.translateInterface = translateInterface;

console.log('🎯 All functions exported to window');
