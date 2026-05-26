const bcrypt = require('bcryptjs');
const hashPassword = (plain) => bcrypt.hash(plain, 12);
const comparePassword = (plain, hashed) => bcrypt.compare(plain, hashed);
module.exports = { hashPassword, comparePassword };
