// User accounts, stored in Upstash Redis. A user can sign in with Google,
// with an email+password, or both — they're the same account as long as
// the email matches. Each user is a JSON object at key `user:<id>`, with
// `user:byEmail:<email>` and `user:byGoogleId:<googleId>` as lookup indexes.
const { redis } = require('./redis');
const bcrypt = require('bcryptjs');

function newId() {
  return 'usr_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function emailKey(email) {
  return String(email || '').trim().toLowerCase();
}

async function findUserByEmail(email) {
  const id = await redis.get('user:byEmail:' + emailKey(email));
  if (!id) return null;
  return redis.get('user:' + id);
}
async function findUserByGoogleId(googleId) {
  const id = await redis.get('user:byGoogleId:' + googleId);
  if (!id) return null;
  return redis.get('user:' + id);
}
async function findUserById(id) {
  if (!id) return null;
  return redis.get('user:' + id);
}

async function saveUser(user) {
  await redis.set('user:' + user.id, user);
  if (user.email) await redis.set('user:byEmail:' + user.email, user.id);
  if (user.googleId) await redis.set('user:byGoogleId:' + user.googleId, user.id);
  return user;
}

// --- Email + password signup/login ---

// Throws 'EMAIL_TAKEN' only if that email already has a password set (i.e.
// they should log in instead). If the email exists from a Google-only
// account, this ADDS a password to it instead of making a duplicate.
async function createUserWithPassword({ name, email, password, phone }) {
  const key = emailKey(email);
  const existing = await findUserByEmail(key);
  if (existing && existing.passwordHash) {
    const err = new Error('Email is already registered');
    err.code = 'EMAIL_TAKEN';
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  if (existing) {
    // Had a Google-only account with this email — add a password to it.
    return saveUser({ ...existing, passwordHash, name: existing.name || (name || '').trim(), phone: existing.phone || (phone || '').trim() });
  }
  const user = {
    id: newId(),
    name: (name || '').trim(),
    email: key,
    phone: (phone || '').trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  return saveUser(user);
}

async function verifyPassword(user, password) {
  if (!user || !user.passwordHash) return false;
  return bcrypt.compare(password, user.passwordHash);
}

// --- Google OAuth ---

// Creates the user on first Google login, or links Google to an existing
// email/password account, or just returns them on later logins.
async function findOrCreateGoogleUser({ googleId, email, name, picture }) {
  let user = await findUserByGoogleId(googleId);
  if (user) {
    // Keep the name already on file (the user may have customized it on our
    // site) rather than letting Google silently overwrite it every login.
    return saveUser({ ...user, name: user.name || name, email: email ? emailKey(email) : user.email, picture: picture || user.picture });
  }
  // Not found by googleId — check if an account with this email already
  // exists (e.g. they signed up with a password first) and link it.
  const byEmail = email ? await findUserByEmail(email) : null;
  if (byEmail) {
    return saveUser({ ...byEmail, googleId, name: byEmail.name || name, picture: picture || byEmail.picture });
  }
  const user2 = {
    id: newId(), googleId,
    name: (name || '').trim(),
    email: emailKey(email),
    phone: '',
    picture: picture || '',
    createdAt: new Date().toISOString(),
  };
  return saveUser(user2);
}

function toPublic(user) {
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, phone: user.phone, picture: user.picture || '' };
}

module.exports = {
  findUserByEmail, findUserByGoogleId, findUserById,
  createUserWithPassword, verifyPassword, findOrCreateGoogleUser, toPublic,
};
