const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('../utils/tokenBlacklist');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  if (isTokenBlacklisted(token)) return res.status(401).json({ error: 'Token revoked' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { requireAuth };


