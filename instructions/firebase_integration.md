# Firebase Integration Design Document

## Project Overview

The goal is to integrate Firebase as a backend for the Reddit Analytics Platform to:

- Save subreddit data fetched via the Reddit API to a Firebase Firestore database.
- Ensure efficient data fetching by only refetching subreddit data if the last update time is older than 24 hours.

This document provides a step-by-step structure for backend engineers, detailing the core components for Firebase integration, database schema design, and workflows necessary to support this functionality.

## Project Structure for Backend Integration

### Components to Build for Firebase Integration

#### API for Data Fetching and Storage:
- A backend API endpoint to fetch subreddit data using Snoowrap.
- Save the fetched data to Firebase Firestore.
- Check the last updated timestamp to determine whether data needs to be refetched.

#### Firebase Integration Layer:
- A utility module to handle interaction with Firebase Firestore (read/write operations).

#### Cloud Functions or Scheduled Tasks:
- Automate periodic checks to determine if data needs to be refetched based on the last update time using Firebase Cloud Functions.

#### Error Handling and Logging:
- Implement robust error handling for database operations and API requests.
- Utilize Firebase logging for monitoring.

## Database Design

### Firestore Collections

The database should use the following collections:

#### 1. Subreddits Collection

Stores the basic metadata of subreddits being tracked.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | String | Document ID (auto-generated or subreddit name). |
| name | String | Name of the subreddit (e.g., openai). |
| url | String | Subreddit URL. |
| createdAt | Timestamp | Timestamp of when the entry was created. |
| updatedAt | Timestamp | Last time the data was updated. |

#### 2. Posts Collection

Stores the fetched posts from each subreddit. Each document should belong to the corresponding subreddit.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | String | Document ID (auto-generated). |
| subredditId | String | Reference to the subreddit document. |
| title | String | Title of the post. |
| content | String | Content of the post. |
| score | Number | Score of the post. |
| numComments | Number | Number of comments. |
| url | String | URL of the post. |
| createdUtc | Timestamp | Post creation time (UTC). |
| fetchedAt | Timestamp | Timestamp of when the post was fetched. |

#### 3. Themes Collection

Stores categorized data analyzed by the OpenAI API.

| Field Name | Data Type | Description |
|------------|-----------|-------------|
| id | String | Document ID (auto-generated). |
| postId | String | Reference to the post document. |
| category | String | Category of the post (e.g., Solution Request, Pain & Anger). |
| confidence | Number | Confidence score of the categorization. |

## Workflow

### 1. Fetching Subreddit Data

**Trigger:**
- Manual trigger via UI or periodic scheduled task.

**Process:**
- Fetch subreddit metadata and posts from Reddit API using Snoowrap.
- Check the updatedAt field in the corresponding document in the Subreddits collection.
- If older than 24 hours, update the data.
- If within 24 hours, skip refetching.
- Insert or update posts in the Posts collection.

### 2. Storing Data in Firebase Firestore

Use a utility function to handle Firestore operations:
- Insert new subreddits into the Subreddits collection if they don't exist.
- Update the updatedAt field when data is refreshed.
- Insert or update posts in the Posts collection, ensuring no duplication.

### 3. Analyzing Posts

**Trigger:**
- After new posts are saved, send data to OpenAI for categorization.

**Process:**
- Use OpenAI API to analyze the content of each post.
- Store results in the Themes collection with the category and confidence score.

### 4. Optimized Data Flow

- Pre-fetch Check: Ensure no unnecessary API calls by comparing updatedAt.
- Batch Processing: Process posts in batches to optimize database and API usage.
- Concurrency: Enable concurrent API calls and Firestore writes for better performance.

## Firebase Integration Code Example

Example function for checking updatedAt and fetching data:

```javascript
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const db = getFirestore();

async function updateSubredditData(subredditName) {
  const subredditRef = doc(db, 'Subreddits', subredditName);
  const subredditDoc = await getDoc(subredditRef);

  if (!subredditDoc.exists()) {
    console.log('Subreddit does not exist. Creating new entry.');
    await setDoc(subredditRef, { name: subredditName, updatedAt: new Date() });
    return;
  }

  const lastUpdated = subredditDoc.data().updatedAt.toDate();
  const now = new Date();
  const hoursSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60);

  if (hoursSinceUpdate > 24) {
    console.log('Fetching new data for subreddit.');
    // Fetch and update data logic
  } else {
    console.log('Data is up-to-date. No fetch needed.');
  }
}
```

## Monitoring and Maintenance

### Error Logging:
- Use Firebase Functions logger to log errors and track issues.

### Performance Monitoring:
- Monitor Firestore read/write performance and optimize queries.

### Scalability:
- Use Firestore security rules to ensure secure access to data.
- Optimize queries with indexes on frequently queried fields (e.g., updatedAt, subredditId).

This document provides a clear structure and schema for backend developers, enabling smooth integration of Firebase into the Reddit Analytics Platform.