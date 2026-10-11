// Login sessions as a signed, httpOnly cookie (JWT). No session table needed —
// the cookie itself carries { id, name } and is verified with SESSION_SECRET.
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const COOKIE_NAME = 'idama_session';
const SEVEN_DAYS = 60 * 60 * 24 * 7;

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error('Missing env var: set SESSION_SECRET on the Idama-lk project in Vercel (any long random string).');
  return s;
}

function createSessionCookie(user) {
  const token = jwt.sign({ id: user.id, name: user.name }, secret(), { expiresIn: SEVEN_DAYS });
  return cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: SEVEN_DAYS,
  });
}
function clearSessionCookie() {
  return cookie.serialize(COOKIE_NAME, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
}
function getSession(req) {
  const header = req.headers && req.headers.cookie;
  if (!header) return null;
  const token = cookie.parse(header)[COOKIE_NAME];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, secret());
    return { id: payload.id, name: payload.name };
  } catch (e) {
    return null;
  }
}

// --- Short-lived CSRF "state" cookie, used only during the Google redirect ---
const STATE_COOKIE = 'idama_oauth_state';

function createStateCookie(state) {
  return cookie.serialize(STATE_COOKIE, state, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 600 });
}
function clearStateCookie() {
  return cookie.serialize(STATE_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
}
function getStateFromRequest(req) {
  const header = req.headers && req.headers.cookie;
  if (!header) return null;
  return cookie.parse(header)[STATE_COOKIE] || null;
}

module.exports = {
  createSessionCookie, clearSessionCookie, getSession,
  createStateCookie, clearStateCookie, getStateFromRequest,
};
