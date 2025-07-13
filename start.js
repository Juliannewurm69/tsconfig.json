import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import axios from 'axios';

export default async function handler(req, res) {
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
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'POST',
    data: {
      oauth_callback: process.env.TWITTER_CALLBACK_URL,
    },
  };

  try {
    const response = await axios.post(request_data.url, null, {
      headers: oauth.toHeader(oauth.authorize(request_data)),
    });

    const params = new URLSearchParams(response.data);
    const oauth_token = params.get('oauth_token');

    res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get Twitter request token' });
  }
}
