const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

const generateToken = () => crypto.randomBytes(32).toString('hex');
const signJwt = (payload) => jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
const verifyJwt = (token) => jwt.verify(token, jwtSecret);

module.exports = { generateToken, signJwt, verifyJwt };
