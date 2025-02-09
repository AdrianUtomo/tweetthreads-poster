// route.ts in /app/api/auth/twitter

import { NextResponse } from 'next/server';
import { twitterClient } from '@/lib/twitter';

export async function GET() {
  try {
    const { url, oauth_token_secret } = await twitterClient.generateAuthLink(
      process.env.TWITTER_CALLBACK_URL!,
      { linkMode: 'authorize' }
    );

    const response = NextResponse.redirect(url);
    response.cookies.set('oauth_token_secret', oauth_token_secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error('Twitter auth error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}