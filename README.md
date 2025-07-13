# Twitter OAuth API for Supabase Dashboard

This mini Next.js API handles Twitter OAuth 1.0a authentication so you can connect Twitter accounts from a Supabase-based dashboard.

## Setup

1. Clone this repo to GitHub
2. Deploy it to [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard:
   - `TWITTER_API_KEY`
   - `TWITTER_API_SECRET`
   - `TWITTER_CALLBACK_URL`

## Usage

- `GET /api/twitter/start` — starts the Twitter OAuth flow
- `GET /api/twitter/callback` — receives the Twitter response and gives access tokens

Link your frontend to `/api/twitter/start` to begin the flow.
