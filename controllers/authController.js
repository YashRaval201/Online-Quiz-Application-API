const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
const { isTokenBlacklisted, blacklistToken } = require('../utils/tokenBlacklist');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const user = await authService.register(email, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const { token } = await authService.login(email, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });
    if (isTokenBlacklisted(token)) return res.status(401).json({ error: 'Token revoked' });

    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ userId: payload.sub, email: payload.email });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(400).json({ error: 'Missing token' });
    blacklistToken(token);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to logout' });
  }
};


