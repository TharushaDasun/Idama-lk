const { findUserByEmail, verifyPassword, toPublic } = require('../../lib/users');
const { createSessionCookie } = require('../../lib/session');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const user = await findUserByEmail(email);
    const valid = await verifyPassword(user, password);
    if (!user || !valid) {
      // Deliberately the same message either way — don't reveal whether the
      // email exists, only whether the login as a whole was valid.
      return res.status(401).json({ error: 'Incorrect email or password' });
    }
    res.setHeader('Set-Cookie', createSessionCookie(user));
    res.status(200).json({ user: toPublic(user) });
  } catch (err) {
    console.error('login failed:', err);
    res.status(500).json({ error: 'Could not log in' });
  }
};
