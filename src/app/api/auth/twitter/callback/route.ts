// route.ts in /app/api/auth/twitter/callback

import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const oauth_token = searchParams.get('oauth_token');
  const oauth_verifier = searchParams.get('oauth_verifier');
  const oauth_token_secret = request.cookies.get('oauth_token_secret')?.value;

  if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
    return NextResponse.json({ error: 'Missing auth parameters' }, { status: 400 });
  }

  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: oauth_token,
      accessSecret: oauth_token_secret,
    });

    const { accessToken, accessSecret } = 
      await client.login(oauth_verifier);

    // Store the tokens securely
    const response = NextResponse.redirect(process.env.TWITTER_DEVELOPMENT_URL!);
    response.cookies.set('twitter_access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    response.cookies.set('twitter_access_secret', accessSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return response;
  } catch (error) {
    console.error('Twitter callback error:', error);
    return NextResponse.json({ error: 'Failed to complete authentication' }, { status: 500 });
  }
} 