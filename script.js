// ... Previous code ...

// Live Ticker Update (Real-time)
async function updateTicker() {
  const news = await fetchNews('general', 1);
  const ticker = document.querySelector('.ticker-text');
  ticker.textContent = news.map(n => n.title).join(' • ');
  ticker.style.animation = 'none'; // Reset
  ticker.offsetHeight; // Trigger reflow
  ticker.style.animation = 'ticker-text 20s linear infinite';
}

setInterval(updateTicker, 60000); // हर मिनट अपडेट

// Initial call
updateTicker();

// Infinite Scroll Listener (Better Perf)
window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && !isLoading) {
    loadMorePosts();
  }
});

// Other functions enhanced with error handling
async function fetchNews(...) {
  try { ... } catch (e) {
    showNotification('News loading failed. Using fallback.', 'error');
  }
}
