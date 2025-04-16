// route.ts in /app/api/auth/twitter

import { NextRequest, NextResponse } from 'next/server';
import { twitterClient } from '@/lib/twitter';

export async function GET(request: NextRequest) {
  try {
    // Get URL information from the request URL
    const { hostname, port, protocol: reqProtocol } = request.nextUrl;
    
    // Determine protocol based on hostname or use the request's protocol
    const protocol = hostname.includes('localhost') ? 'http' : (reqProtocol || 'https');
    
    // Build the host string with port if it exists
    const host = port ? `${hostname}:${port}` : hostname;
    
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