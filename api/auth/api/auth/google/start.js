const crypto = require('crypto');
const { createStateCookie } = require('../../../lib/session');

function redirectUri() {
  const uri = process.env.GOOGLE_REDIRECT_URI;
  if (!uri) throw new Error('Missing env var: set GOOGLE_REDIRECT_URI (must exactly match the URI registered in Google Cloud Console).');
  return uri;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).json({ error: 'Missing env var GOOGLE_CLIENT_ID' });

  const state = crypto.randomBytes(16).toString('hex');
  // Where to send the user back to after login — the seller dashboard, by default.
  const returnTo = typeof req.query.returnTo === 'string' ? req.query.returnTo : '/dashboard/seller-dashboard.html';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    prompt: 'select_account',
    state: state + '|' + encodeURIComponent(returnTo),
  });

  res.setHeader('Set-Cookie', createStateCookie(state));
  res.writeHead(302, { Location: 'https://accounts.google.com/o/oauth2/v2/auth?' + params.toString() });
  res.end();
};
