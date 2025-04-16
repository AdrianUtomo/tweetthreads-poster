import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get URL information from the request URL
  const { hostname, port, protocol: reqProtocol } = request.nextUrl;
  
  // Determine protocol based on hostname or use the request's protocol
  const protocol = hostname.includes('localhost') ? 'http' : (reqProtocol || 'https');
  
  // Build the host string with port if it exists
  const host = port ? `${hostname}:${port}` : hostname;
  
  // Construct the dynamic base URL
  const baseUrl = `${protocol}://${host}`;
  
  const response = NextResponse.redirect(new URL('/', baseUrl));
  
  // Clear the authentication cookies
  response.cookies.delete('twitter_access_token');
  response.cookies.delete('twitter_access_secret');
  response.cookies.delete('oauth_token_secret');
  
  return response;
}