// ... (Keep all previous code) ...

// Infinite Scroll
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMorePosts();
    }
});

// Back to Top Button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backToTop.style.display = (window.scrollY > 300) ? 'block' : 'none';
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Comment with Username (After Login)
document.getElementById('comment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const comment = e.target.querySelector('textarea').value.trim();
    const username = localStorage.getItem('username') || 'Guest';
    if (comment) {
        const commentsList = document.getElementById('comments-list');
        const commentEl = document.createElement('div');
        commentEl.innerHTML = `<strong>${username}:</strong> ${comment}`;
        commentsList.insertBefore(commentEl, commentsList.firstChild);
        e.target.reset();
        console.log(`💬 Comment added by ${username}: ${comment}`);
    }
});

// In handleLogin, add:
function handleLogin() {
    // ... (previous)
    if (username && password) {
        localStorage.setItem('username', username);
        // ...
    }
}

// ... (rest same)
