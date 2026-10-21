const { createUserWithPassword, toPublic } = require('../../lib/users');
const { createSessionCookie } = require('../../lib/session');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, password, phone } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const user = await createUserWithPassword({ name, email, password, phone });
    res.setHeader('Set-Cookie', createSessionCookie(user));
    res.status(201).json({ user: toPublic(user) });
  } catch (err) {
    if (err.code === 'EMAIL_TAKEN') {
      return res.status(409).json({ error: 'An account with this email already exists — try logging in instead.' });
    }
    console.error('signup failed:', err);
    res.status(500).json({ error: 'Could not create account' });
  }
};
