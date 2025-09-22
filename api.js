export async function fetchPosts(category, limit = 10) {
  try {
    // Replace with your NewsAPI key and endpoint
    const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${category.toLowerCase()}&apiKey=YOUR_API_KEY&pageSize=${limit}`);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    return data.articles.map(article => ({
      title: article.title || 'Untitled',
      description: article.description || 'No description available.',
      image: article.urlToImage || '/images/fallback.jpg',
      category: category,
      date: new Date(article.publishedAt).toLocaleDateString()
    }));
  } catch (error) {
    console.error('Fetch Posts Error:', error);
    return generatePosts(category, limit); // Fallback
  }
}

export async function submitComment(postId, comment) {
  try {
    // Replace with your backend API endpoint
    // const response = await fetch('https://api.news.com/comments', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ postId, comment })
    // });
    // if (!response.ok) throw new Error('Comment submission failed');
    // return await response.json();
    
    console.log(`Comment submitted for post ${postId}: ${comment}`);
    return { success: true };
  } catch (error) {
    console.error('Submit Comment Error:', error);
    return null;
  }
}

// Fallback Mock Data
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
