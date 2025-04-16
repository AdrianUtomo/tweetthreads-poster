// route.ts in /app/api/auth/twitter

import { NextRequest, NextResponse } from 'next/server';
import { twitterClient } from '@/lib/twitter';

export async function GET(request: NextRequest) {
  try {
    // Get the host from the request
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    
    // Construct the dynamic callback URL
    const callbackUrl = `${protocol}://${host}/api/auth/twitter/callback`;
    
    const { url, oauth_token_secret } = await twitterClient.generateAuthLink(
      callbackUrl,
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