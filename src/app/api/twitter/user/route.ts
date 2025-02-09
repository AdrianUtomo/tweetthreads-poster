import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function GET(request: NextRequest) {
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

    // Get user data
    const me = await client.v2.me({
      'user.fields': ['name', 'username', 'profile_image_url', 'description']
    });

    return NextResponse.json(me.data);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}