// Horizon - Complete Working Script
document.addEventListener('DOMContentLoaded', function() {
  // Initialize app
  showCategory('Home');
  setupEventListeners();
});

// Sidebar Toggle
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mainContent = document.getElementById('mainContent');
  
  sidebar.classList.toggle('open');
  mobileBtn.classList.toggle('active');
  
  if (sidebar.classList.contains('open')) {
    mainContent.classList.add('shifted');
  } else {
    mainContent.classList.remove('shifted');
  }
}

// Show Category
function showCategory(category) {
  // Close sidebar on mobile
  if (window.innerWidth < 768) {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('mobileMenuBtn').classList.remove('active');
    document.getElementById('mainContent').classList.remove('shifted');
  }
  
  // Update title
  document.getElementById('page-title').textContent = `${category} - Latest Updates`;
  
  // Update active nav
  document.querySelectorAll('.slide').forEach(slide => slide.classList.remove('active'));
  const activeSlide = document.querySelector(`[onclick="showCategory('${category}')"]`);
  if (activeSlide) activeSlide.classList.add('active');
  
  // Load content
  loadCategoryContent(category);
  
  // Close comments modal
  document.getElementById('commentsModal').classList.add('hidden');
}

// Load Category Content
function loadCategoryContent(category) {
  const container = document.getElementById('recent-posts');
  container.innerHTML = ''; // Clear previous
  
  // Sample posts (real में API से लें)
  const samplePosts = [
    { title: `${category} Breaking News 1`, desc: `Latest updates about ${category}...`, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
    { title: `${category} Top Story 2`, desc: `Important developments in ${category} sector...`, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
    { title: `${category} Latest Update 3`, desc: `Recent events and analysis for ${category}...`, img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400' },
    { title: `${category} Featured 4`, desc: `In-depth coverage of ${category} news...`, img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400' },
    { title: `${category} Alert 5`, desc: `Breaking developments in ${category}...`, img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400' },
    { title: `${category} Report 6`, desc: `Comprehensive report on ${category} trends...`, img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' }
  ];
  
  samplePosts.forEach((post, index) => {
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.innerHTML = `
      <img src="${post.img}" alt="${post.title}" loading="lazy">
      <h3>${post.title}</h3>
      <p>${post.desc}</p>
      <div class="post-meta">
        <span class="category-tag">${category}</span>
        <span class="date">${new Date().toLocaleDateString()}</span>
      </div>
      <div class="post-actions">
        <button onclick="likePost(this)" class="like-btn">❤️ 24</button>
        <button onclick="sharePost('${post.title}')" class="share-btn">📤 Share</button>
        <button onclick="openComments('${post.title}')" class="comment-btn">💬 Comment</button>
      </div>
    `;
    container.appendChild(postCard);
  });
  
  // Show load more if needed
  document.getElementById('load-more').classList.remove('hidden');
}

// Study Toggle
function toggleStudy() {
  const studyGroup = document.getElementById('studyGroup');
  const expandIcon = event.currentTarget.querySelector('.expand-icon');
  
  studyGroup.classList.toggle('hidden');
  expandIcon.classList.toggle('rotated');
  
  // Close workshop if open
  const workshopGroup = document.getElementById('workshopGroup');
  if (!workshopGroup.classList.contains('hidden')) {
    document.querySelector('.workshop-group .expand-icon').classList.remove('rotated');
    workshopGroup.classList.add('hidden');
  }
}

// Workshop Toggle
function toggleWorkshop() {
  const workshopGroup = document.getElementById('workshopGroup');
  const expandIcon = event.currentTarget.querySelector('.expand-icon');
  
  workshopGroup.classList.toggle('hidden');
  expandIcon.classList.toggle('rotated');
  
  // Close study if open
  const studyGroup = document.getElementById('studyGroup');
  if (!studyGroup.classList.contains('hidden')) {
    document.querySelector('.study-group .expand-icon').classList.remove('rotated');
    studyGroup.classList.add('hidden');
  }
}

// Search
function searchPosts() {
  const query = document.getElementById('searchBar').value.toLowerCase();
  const posts = document.querySelectorAll('.post-card');
  
  posts.forEach(post => {
    const text = post.textContent.toLowerCase();
    post.style.display = text.includes(query) ? 'block' : 'none';
  });
}

// Theme Toggle
function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  event.target.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Settings
function openSettings() {
  document.getElementById('settingsModal').classList.add('show');
}

function closeSettings() {
  document.getElementById('settingsModal').classList.remove('show');
}

function handleLogin() {
  const username = document.getElementById('loginUsername').value;
  if (username) {
    alert(`Welcome ${username}!`);
    closeSettings();
  } else {
    alert('Please enter username');
  }
}

// Comments
function openComments(title) {
  document.getElementById('comment-title').textContent = `${title} - Comments`;
  document.getElementById('commentsModal').classList.remove('hidden');
}

function closeComments() {
  document.getElementById('commentsModal').classList.add('hidden');
}

// Load More (Demo)
function loadMorePosts() {
  const btn = event.target;
  btn.textContent = 'Loading...';
  btn.disabled = true;
  
  setTimeout(() => {
    // Add more posts (demo)
    const container = document.getElementById('recent-posts');
    const newPost = document.createElement('div');
    newPost.className = 'post-card';
    newPost.innerHTML = `
      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" alt="New Post">
      <h3>New Loaded Post</h3>
      <p>This is a dynamically loaded post...</p>
      <div class="post-actions">
        <button class="like-btn">❤️ 12</button>
        <button class="share-btn">📤 Share</button>
      </div>
    `;
    container.appendChild(newPost);
    btn.textContent = 'Load More';
    btn.disabled = false;
  }, 1000);
}

// Event Listeners
function setupEventListeners() {
  // Close sidebar on outside click
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 768) {
      const sidebar = document.getElementById('sidebar');
      const mobileBtn = document.getElementById('mobileMenuBtn');
      if (!sidebar.contains(e.target) && !mobileBtn.contains(e.target)) {
        if (sidebar.classList.contains('open')) {
          toggleSidebar();
        }
      }
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSettings();
      closeComments();
      if (document.getElementById('sidebar').classList.contains('open')) {
        toggleSidebar();
      }
    }
  });

  // Load theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    document.querySelector('.toggle-btn').textContent = '☀️';
  }
}

// Utility Functions
function likePost(btn) {
  const likes = parseInt(btn.textContent.match(/\d+/)[0]) + 1;
  btn.textContent = `❤️ ${likes}`;
}

function sharePost(title) {
  if (navigator.share) {
    navigator.share({ title: `Horizon: ${title}` });
  } else {
    alert('Share: ' + title);
  }
}

// Initialize
console.log('🌅 Horizon Loaded Successfully!');
