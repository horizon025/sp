let isDarkMode = false;
let currentLanguage = 'en';

document.addEventListener('DOMContentLoaded', function() {
  // Initialize
});

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  sidebar.classList.toggle('open');
  mainContent.classList.toggle('shifted');
}

function showCategory(category) {
  const posts = document.getElementById('recent-posts');
  posts.innerHTML = '';
  const samplePosts = {
    Home: [{ title: "Welcome to Horizon", date: "13 Sep 2025", content: "Explore the latest updates." }],
    News: [{ title: "Breaking News", date: "12 Sep 2025", content: "Major event today." }],
    Live: [{ title: "Live", date: "11 Sep 2025", content: "Watch live now." }],
    '10thBoardHindi': [{ title: "Recent", date: "10 Sep 2025", content: "Recent study material." }],
    '10thBoardEnglish': [{ title: "Recent", date: "10 Sep 2025", content: "Recent study material." }],
    '12thBoardHindi': [{ title: "Recent", date: "10 Sep 2025", content: "Recent study material." }],
    '12thBoardEnglish': [{ title: "Recent", date: "10 Sep 2025", content: "Recent study material." }],
    'CompetitiveHindi': [{ title: "Recent", date: "10 Sep 2025", content: "Recent exam prep." }],
    'CompetitiveEnglish': [{ title: "Recent", date: "10 Sep 2025", content: "Recent exam prep." }],
    Cafe: [{ title: "Recent", date: "9 Sep 2025", content: "Recent learning session." }],
    WebsiteBuilder: [{ title: "Recent", date: "9 Sep 2025", content: "Recent building guide." }],
    // Add more as needed
  };
  if (category === 'Home' || category === 'All') {
    const recentPosts = Object.values(samplePosts).flat().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    recentPosts.forEach(post => {
      const postDiv = document.createElement('div');
      postDiv.className = 'post-card animate__animated animate__fadeIn';
      postDiv.innerHTML = `<h3 class="font-bold text-lg mb-2">${post.title}</h3><p class="text-sm text-gray-500 mb-2">${post.date}</p><p>${post.content}</p>`;
      posts.appendChild(postDiv);
    });
  } else if (samplePosts[category]) {
    samplePosts[category].forEach(post => {
      const postDiv = document.createElement('div');
      postDiv.className = 'post-card animate__animated animate__fadeIn';
      postDiv.innerHTML = `<h3 class="font-bold text-lg mb-2">${post.title}</h3><p class="text-sm text-gray-500 mb-2">${post.date}</p><p>${post.content}</p>`;
      posts.appendChild(postDiv);
    });
  }
}

function searchPosts() {
  const query = document.getElementById('searchBar').value.toLowerCase();
  const posts = document.getElementById('recent-posts').getElementsByClassName('post-card');
  for (let post of posts) {
    const text = post.innerText.toLowerCase();
    post.style.display = text.includes(query) ? '' : 'none';
  }
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark', isDarkMode);
}

function translateInterface(lang) {
  currentLanguage = lang;
  const translations = {
    en: { Home: "Home", News: "News", Live: "Live", Tech: "Tech", Study: "Study", Workshop: "Workshop", Bollywood: "Bollywood", Sports: "Sports", Stocks: "Stocks", Entertainment: "Entertainment", Extra: "Extra", Contact: "Contact" , '10th Board Hindi': "10th Board Hindi", '10th Board English': "10th Board English", '12th Board Hindi': "12th Board Hindi", '12th Board English': "12th Board English", 'Competitive Exams Hindi': "Competitive Exams Hindi", 'Competitive Exams English': "Competitive Exams English", Cafe: "Cafe", WebsiteBuilder: "Website Builder", Editor: "Editor", Designer: "Designer", ContentCreator: "Content Creator", Affiliate: "Affiliate", Dropshipping: "Dropshipping", Promotion: "Promotion" , Trending: "Trending", Videos: "Videos", Politics: "Politics", Health: "Health" },
    hi: { Home: "होम", News: "समाचार", Live: "लाइव", Tech: "टेक", Study: "स्टडी", Workshop: "वर्कशॉप", Bollywood: "बॉलीवुड", Sports: "खेल", Stocks: "स्टॉक्स", Entertainment: "मनोरंजन", Extra: "अतिरिक्त", Contact: "संपर्क" , '10th Board Hindi': "10वीं बोर्ड हिंदी", '10th Board English': "10वीं बोर्ड इंग्लिश", '12th Board Hindi': "12वीं बोर्ड हिंदी", '12th Board English': "12वीं बोर्ड इंग्लिश", 'Competitive Exams Hindi': "प्रतियोगी परीक्षा हिंदी", 'Competitive Exams English': "प्रतियोगी परीक्षा इंग्लिश", Cafe: "कैफे", WebsiteBuilder: "वेबसाइट बिल्डर", Editor: "एडिटर", Designer: "डिजाइनर", ContentCreator: "कंटेंट क्रिएटर", Affiliate: "एफिलिएट", Dropshipping: "ड्रॉपशिपिंग", Promotion: "प्रमोशन" , Trending: "ट्रेंडिंग", Videos: "वीडियो", Politics: "राजनीति", Health: "स्वास्थ्य" }
  };
  const slides = document.querySelectorAll('.slide');
  slides.forEach(slide => {
    const text = slide.textContent.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/, '').trim();
    slide.textContent = translations[lang][text] || text;
  });
  document.querySelector('.post-section h2').textContent = lang === 'hi' ? "नवीनतम 5 पोस्ट" : "Latest 5 Posts";
}

function toggleStudy() {
  const group = document.getElementById('studyGroup');
  group.classList.toggle('hidden');
}

function toggleWorkshop() {
  const group = document.getElementById('workshopGroup');
  group.classList.toggle('hidden');
}

function handleLogin() {
  const username = document.getElementById('loginUsername').value;
  alert(`Logged in as ${username}`);
}

function handleRegister() {
  const username = document.getElementById('loginUsername').value;
  alert(`Registered as ${username}`);
}

function openSettings() {
  document.getElementById('settingsModal').classList.add('open');
}

function closeSettings() {
  document.getElementById('settingsModal').classList.remove('open');
}

function setTheme(theme) {
  if (theme === 'dark') document.body.classList.add('dark');
  else if (theme === 'light') document.body.classList.remove('dark');
  else document.body.classList.remove('dark');
}

function enableNotifications() {
  alert('Notifications enabled');
}

function disableNotifications() {
  alert('Notifications disabled');
}

function viewPrivacyPolicy() {
  alert('Privacy Policy: Your data is safe with us.');
}

window.onload = function() {
  showCategory('Home');
  const ctx = document.getElementById('analyticsChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Visitors',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
  document.getElementById('downloadChart').addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'analytics_chart.png';
    link.href = chart.toBase64Image('image/png', 1.0);
    link.click();
  });
};
