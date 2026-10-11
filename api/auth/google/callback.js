const { getStateFromRequest, clearStateCookie, createSessionCookie } = require('../../../lib/session');
const { findOrCreateGoogleUser } = require('../../../lib/users');

function redirectUri() {
  return process.env.GOOGLE_REDIRECT_URI;
}

function failRedirect(res, reason) {
  res.writeHead(302, { Location: '/dashboard/seller-dashboard.html?loginError=' + encodeURIComponent(reason) });
  res.end();
}

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { code, state: stateParam, error } = req.query;
  if (error) return failRedirect(res, 'google_denied');
  if (!code || !stateParam) return failRedirect(res, 'missing_code');

  const [state, returnToEncoded] = String(stateParam).split('|');
  const returnTo = returnToEncoded ? decodeURIComponent(returnToEncoded) : '/dashboard/seller-dashboard.html';

  const expectedState = getStateFromRequest(req);
  if (!expectedState || expectedState !== state) {
    return failRedirect(res, 'bad_state');
  }

  try {
    // 1. Exchange the authorization code for tokens.
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri(),
        grant_type: 'authorization_code',
      }),
    });
    if (!tokenRes.ok) return failRedirect(res, 'token_exchange_failed');
    const tokens = await tokenRes.json();

    // 2. Fetch the user's profile with the access token.
    const profileRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: 'Bearer ' + tokens.access_token },
    });
    if (!profileRes.ok) return failRedirect(res, 'profile_fetch_failed');
    const profile = await profileRes.json();
    if (!profile.sub) return failRedirect(res, 'no_profile_id');

    // 3. Find or create our user record, and start a session.
    const user = await findOrCreateGoogleUser({
      googleId: profile.sub, email: profile.email, name: profile.name, picture: profile.picture,
    });

    res.setHeader('Set-Cookie', [createSessionCookie(user), clearStateCookie()]);
    res.writeHead(302, { Location: returnTo + (returnTo.includes('?') ? '&' : '?') + 'loggedIn=1' });
    res.end();
  } catch (err) {
    failRedirect(res, 'server_error');
  }
};
