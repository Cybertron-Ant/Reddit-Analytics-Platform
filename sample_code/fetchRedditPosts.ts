import Snoowrap from 'snoowrap';

// Configure Snoowrap with your Reddit API credentials
const r = new Snoowrap({
  userAgent: 'your user-agent',
  clientId: 'your client id',
  clientSecret: 'your client secret',
  refreshToken: 'your refresh token'
});

async function fetchPosts() {
  try {
    // Fetch posts from the 'ollama' subreddit from the past 24 hours
    const posts = await r.getSubreddit('ollama').getNew({ time: 'day' });

    // Extract and log the required details for each post
    posts.forEach(post => {
      console.log({
        title: post.title,
        content: post.selftext,
        score: post.score,
        num_comments: post.num_comments,
        date: new Date(post.created_utc * 1000)
      });
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

fetchPosts();
