import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(new URL('/', process.env.TWITTER_DEVELOPMENT_URL!));
  
  // Clear the authentication cookies
  response.cookies.delete('twitter_access_token');
  response.cookies.delete('twitter_access_secret');
  response.cookies.delete('oauth_token_secret');
  
  return response;
}