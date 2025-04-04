import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('twitter_access_token')?.value;
  const accessSecret = request.cookies.get('twitter_access_secret')?.value;

  if (!accessToken || !accessSecret) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    const data = await request.json();
    
    if (!data.posts || !Array.isArray(data.posts) || data.posts.length === 0) {
      return NextResponse.json({ error: 'No posts provided' }, { status: 400 });
    }

    // For single post
    if (data.posts.length === 1) {
      const post = data.posts[0];
      console.log('Posting single tweet:', post.content);
      
      // Handle media if present
      const mediaIds: string[] = [];
      if (post.media && post.media.length > 0) {
        // This would require handling file uploads and using Twitter's media upload API
        // For simplicity, we're skipping media upload in this example
        console.log('Media would be uploaded here');
      }
      
      const tweet = await client.v2.tweet(post.content, {
        media: mediaIds.length > 0 ? { media_ids: mediaIds.slice(0, 4) as [string] | [string, string] | [string, string, string] | [string, string, string, string] } : undefined
      });
      
      return NextResponse.json({ success: true, tweet });
    } 
    // For thread
    else {
      console.log('Posting thread with', data.posts.length, 'tweets');
      
      let lastTweetId: string | undefined;
      const tweetIds = [];
      
      // Post each tweet in the thread
      for (const post of data.posts) {
        const tweetOptions: any = {};
        
        if (lastTweetId) {
          tweetOptions.reply = { in_reply_to_tweet_id: lastTweetId };
        }
        
        // Handle media (simplified)
        if (post.media && post.media.length > 0) {
          console.log('Media would be uploaded here for thread tweet');
        }
        
        const tweet = await client.v2.tweet(post.content, tweetOptions);
        lastTweetId = tweet.data.id;
        tweetIds.push(lastTweetId);
      }
      
      return NextResponse.json({ success: true, tweetIds });
    }
  } catch (error) {
    console.error('Error posting tweet:', error);
    return NextResponse.json({ error: 'Failed to post tweet' }, { status: 500 });
  }
}