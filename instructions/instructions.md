# Product Requirements Document (PRD) for Reddit Analytics Platform

## Project Overview
You are building a Reddit analytics platform, where users can get analytics of different subreddits. The platform allows users to:
- View top content from subreddits.
- Analyze categories of posts (e.g., solution requests, advice requests, etc.).

### Technology Stack
- **Next.js 14**
- **Shadcn** (UI components)
- **Tailwind CSS** (styling)
- **Lucid Icons** (iconography)
- **Snoowrap** (Reddit API interaction)
- **OpenAI API** (for post categorization)

## Core Functionalities

### 1. **See List of Available Subreddits & Add New Subreddits**
- **Display Existing Subreddits:**
  - Users can see a list of already-created subreddits displayed as cards.
  - Example subreddits: `ollama`, `openai`.
- **Add New Subreddit:**
  - Users can click an “Add Subreddit” button.
  - A modal should appear where users can paste a Reddit URL.
  - After submission, a new card should be added dynamically to the list.

### 2. **Subreddit Page**
- **Navigation:**
  - Clicking on a subreddit card navigates to a dedicated subreddit page.
- **Tabs:**
  - The page includes two tabs:
    1. **Top Posts**
    2. **Themes**

### 3. **Fetch Reddit Posts Data in "Top Posts"**
- **Requirements:**
  - Display fetched Reddit posts from the past 24 hours.
  - Use the **Snoowrap** library to interact with the Reddit API.
- **Data Fields for Each Post:**
  - Title
  - Score
  - Content
  - URL
  - Created UTC (date and time)
  - Number of comments
- **UI Layout:**
  - Display posts in a sortable table component (default sort: highest score).

### 4. **Analyze Reddit Posts Data in "Themes"**
- **Categorization:**
  - For each post, send data to OpenAI API for categorization.
  - Categories:
    1. **Solution Requests:** Posts where users seek solutions to problems.
    2. **Pain & Anger:** Posts expressing pain or frustration.
    3. **Advice Requests:** Posts seeking advice.
    4. **Money Talk:** Posts discussing finances.
- **Concurrency:**
  - Run the categorization process concurrently for faster results.
- **UI Layout:**
  - Display each category as a card with:
    - Title
    - Description
    - Number of posts in the category
  - Clicking on a card opens a side panel displaying all posts within that category.

### 5. **Ability to Add New Cards**
- **Add Card Functionality:**
  - Users can add new cards dynamically to the platform.
- **Trigger Analysis:**
  - Adding a card triggers the analysis process again.

## Example Code and Documentation

### Snoowrap Configuration
Example code for configuring Snoowrap to fetch Reddit posts:

```javascript
import Snoowrap from 'snoowrap';

const r = new Snoowrap({
  userAgent: 'your user-agent',
  clientId: 'your client id',
  clientSecret: 'your client secret',
  refreshToken: 'your refresh token'
});

async function fetchPosts() {
  try {
    const posts = await r.getSubreddit('ollama').getNew({ time: 'day' });
    return posts.map(post => ({
      title: post.title,
      content: post.selftext,
      score: post.score,
      num_comments: post.num_comments,
      date: new Date(post.created_utc * 1000),
      url: post.url
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}
```

### Example API Response
Response from the Snoowrap API when fetching posts:

```json
[
  {
    "title": "Example Post Title",
    "content": "This is the content of the post.",
    "score": 123,
    "num_comments": 45,
    "date": "2025-01-01T12:00:00Z",
    "url": "https://reddit.com/r/example/comments/abc123"
  }
]
```

## File Structure
To ensure alignment, here is the file structure for this project:

```plaintext
reddit-analytics-platform/
├── public/                     # Static assets
│   ├── icons/                  # Lucid icons
│   └── favicon.ico             # App favicon
├── src/                        # Source code
│   ├── components/             # Reusable components
│   │   ├── Navbar.js           # Navigation bar
│   │   ├── SubredditCard.js    # Subreddit card component
│   │   ├── PostsTable.js       # Table for posts
│   │   └── Sidebar.js          # Side panel for "Themes"
│   ├── pages/                  # Next.js pages
│   │   ├── index.js            # Home page
│   │   ├── subreddit/[id].js   # Dynamic subreddit page
│   │   └── api/                # API handlers
│   │       ├── fetchPosts.js   # Fetch Reddit posts
│   │       └── analyzePosts.js # Analyze posts using OpenAI
│   ├── styles/                 # Stylesheets
│   │   └── globals.css         # Tailwind CSS styles
│   ├── utils/                  # Utility functions
│   │   ├── fetchReddit.js      # Reddit API wrapper functions
│   │   └── categorizePosts.js  # Post categorization logic
│   ├── hooks/                  # Custom hooks
│   │   └── useFetch.js         # Data fetching hook
│   ├── contexts/               # Global state management
│   │   └── SubredditContext.js # Subreddit state context
│   └── app/                    # Next.js app configuration
│       └── _app.js             # Global setup
├── .env                        # Environment variables
├── package.json                # Project dependencies
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── README.md                   # Documentation
```

### Documentation Details
- Include examples of expected API requests and responses (see above).
- Provide a clear explanation of how each major component interacts (e.g., how "Themes" uses OpenAI for analysis).
- Ensure code snippets are accessible in the `README.md` for developer reference.

---
This PRD provides clear alignment for the development team by specifying the scope, technology stack, functionality, and necessary documentation to ensure smooth implementation.

