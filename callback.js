import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import axios from 'axios';

export default async function handler(req, res) {
  const { oauth_token, oauth_verifier } = req.query;

  const oauth = new OAuth({
    consumer: {
      key: process.env.TWITTER_API_KEY,
      secret: process.env.TWITTER_API_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    },
  });

  const request_data = {
    url: 'https://api.twitter.com/oauth/access_token',
    method: 'POST',
    data: { oauth_verifier },
  };

  try {
    const response = await axios.post(
      request_data.url,
      new URLSearchParams({ oauth_token, oauth_verifier }),
      {
        headers: oauth.toHeader(oauth.authorize(request_data)),
      }
    );

    const params = new URLSearchParams(response.data);
    const access_token = params.get('oauth_token');
    const access_token_secret = params.get('oauth_token_secret');
    const screen_name = params.get('screen_name');

    res.status(200).json({
      success: true,
      screen_name,
      access_token,
      access_token_secret,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Twitter OAuth callback failed' });
  }
}
