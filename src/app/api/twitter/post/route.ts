import { NextRequest, NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import { PostData, ThreadTweetOptions } from "@/types";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("twitter_access_token")?.value;
  const accessSecret = request.cookies.get("twitter_access_secret")?.value;

  if (!accessToken || !accessSecret) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
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
      return NextResponse.json({ error: "No posts provided" }, { status: 400 });
    }

    // For single post
    if (data.posts.length === 1) {
      const post: PostData = data.posts[0];
      console.log("Posting single tweet:", post.content);

      // Handle media if present
      const mediaIds: string[] = [];
      if (post.media && post.media.length > 0) {
        // Upload each media file to Twitter
        for (const mediaItem of post.media) {
          try {
            // Check if buffer and mimeType exist
            if (mediaItem.buffer && mediaItem.mimeType) {
              const mediaId = await client.v1.uploadMedia(
                Buffer.from(mediaItem.buffer, "base64"),
                { mimeType: mediaItem.mimeType }
              );
              mediaIds.push(mediaId);
            }
          } catch (mediaError) {
            console.error("Error uploading media:", mediaError);
          }
        }
        console.log(`Uploaded ${mediaIds.length} media items`);
      }

      const tweet = await client.v2.tweet(post.content, {
        media:
          mediaIds.length > 0
            ? {
                media_ids: mediaIds.slice(0, 4) as
                  | [string]
                  | [string, string]
                  | [string, string, string]
                  | [string, string, string, string],
              }
            : undefined,
      });

      return NextResponse.json({ success: true, tweet });
    }
    // For thread
    else {
      console.log("Posting thread with", data.posts.length, "tweets");

      // Prepare the thread content with media
      const threadTweets = await Promise.all(
        data.posts.map(async (post: PostData) => {
          const tweetMediaIds: string[] = [];

          // Handle media for this tweet
          if (post.media && post.media.length > 0) {
            // Upload each media file to Twitter
            for (const mediaItem of post.media) {
              try {
                if (mediaItem.buffer && mediaItem.mimeType) {
                  const mediaId = await client.v1.uploadMedia(
                    Buffer.from(mediaItem.buffer, "base64"),
                    { mimeType: mediaItem.mimeType }
                  );
                  tweetMediaIds.push(mediaId);
                }
              } catch (mediaError) {
                console.error("Error uploading media:", mediaError);
              }
            }
            console.log(
              `Uploaded ${tweetMediaIds.length} media items for thread tweet`
            );
          }

          // Return tweet content with media IDs
          const res: ThreadTweetOptions = {
            text: post.content,
            media:
              tweetMediaIds.length > 0
                ? {
                    media_ids: tweetMediaIds.slice(0, 4) as
                      | [string]
                      | [string, string]
                      | [string, string, string]
                      | [string, string, string, string],
                  }
                : undefined,
          };
          return res;
        })
      );

      // Post the entire thread at once
      const thread = await client.v2.tweetThread(threadTweets);

      return NextResponse.json({
        success: true,
        tweetIds: thread.map((tweet) => tweet.data.id),
      });
    }
  } catch (error) {
    console.error("Error posting tweet:", error);
    return NextResponse.json(
      { error: "Failed to post tweet" },
      { status: 500 }
    );
  }
}
