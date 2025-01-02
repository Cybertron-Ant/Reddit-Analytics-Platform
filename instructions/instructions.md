# Project overview
You are building a Reddit analytics platform, where users can get analytics of different sub reddits, where they can see top contents and see category of posts;

### Technology Stack:
- NextJS 14
- Shadcn 
- Tailwind css 
- Lucid icons

Here is the updated text with the missing details added:

---

# Core functionalities  

1. **See list of available subreddits & add new subreddits**  
    - Users can see a list of available subreddits that already created, displayed in cards, common ones like "ollama", "openai"  
    - Users can click on an add subreddit button, which should open a modal for users to paste in a Reddit URL and add  
    - After users add a new subreddit, a new card should be added  

2. **Subreddit page**  
    1. Clicking on each subreddit should go to a Reddit page  
    2. With 2 tabs: "Top posts", "Themes"  

3. **Fetch Reddit posts data in "Top posts"**  
    - Under "Top posts" page, we want to display fetched Reddit posts from the past 24 hours  
    - We will use snoowrap as the library to fetch Reddit data  
    - Each post including title, score, content, URL, created_utc, num_comments  
    - Display the subreddits in a table component, sorted based on the number of scores  

4. **Analyze Reddit posts data in "Themes"**  
    1. For each post, we should send post data to OpenAI using structured output to categorize posts into:  
        - "Solution requests": Posts where people are seeking solutions for problems  
        - "Pain & anger": Posts where people are expressing pain or anger  
        - "Advice requests": Posts where people are seeking advice  
        - "Money talk": Posts where people are talking about spending money  
    2. This process needs to be run concurrently for posts, so it will be faster  
    3. In the "Themes" page, we should display each category as a card, with title, description, and the number of counts  
    4. Clicking on the card will open a side panel to display all posts under this category  

5. **Ability to add new cards**  
    1. Users should be able to add a new card  
    2. After a new card is added, it should trigger the analysis again  

--- 

# Doc
### Documentation of how to use Snoowrap to fetch Reddit posts data
CODE EXAMPLE:
```
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

```

# Current file structure
To get the file structure of all files inside `D:\Users\DevPC4\ant\Reddit-Analytics-Platform\reddit`, you can use the `tree` package in the terminal. Here is how you can do it:

1. Open your terminal.
2. Navigate to the `D:\Users\DevPC4\ant\Reddit-Analytics-Platform\reddit` directory:
    ```sh
    cd D:\Users\DevPC4\ant\Reddit-Analytics-Platform\reddit
    ```
3. Run the `tree` command to display the file structure:
    ```sh
    tree
    ```