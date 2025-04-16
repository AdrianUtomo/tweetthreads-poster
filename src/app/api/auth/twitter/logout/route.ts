import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the host from the request
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  
  // Construct the dynamic base URL
  const baseUrl = `${protocol}://${host}`;
  
  const response = NextResponse.redirect(new URL('/', baseUrl));
  
  // Clear the authentication cookies
  response.cookies.delete('twitter_access_token');
  response.cookies.delete('twitter_access_secret');
  response.cookies.delete('oauth_token_secret');
  
  return response;
}