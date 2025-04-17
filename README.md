## Environment Variables

To run this application, you need to set up the following environment variables in a `.env.local` file in the root directory:

```env
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
```

### How to obtain Twitter API credentials:

1. Create a Twitter Developer account at [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new project and app in the developer portal
3. Set up your app with Read and Write permissions
4. Generate API keys and secrets in the "Keys and Tokens" section
5. Copy your API Key and API Secret to your `.env.local` file

Note: Make sure your Twitter Developer App has OAuth 1.0a enabled and has the appropriate callback URL configured (typically `http://localhost:3000/api/auth/twitter/callback` for local development).

## Getting Started

First, install all the dependencies:

```bash
npm install
```

then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.