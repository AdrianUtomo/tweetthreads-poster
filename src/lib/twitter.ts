import { TwitterApi } from "twitter-api-v2";

if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
  throw new Error('Twitter credentials are not properly configured');
}

// Create client for generating auth links
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
});

// Create a client for read-write operations
export const twitterClient = client.readWrite;