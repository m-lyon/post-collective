// Constants used throughout the application
const WHITELISTED_DOMAINS = process.env.WHITELISTED_DOMAINS;
const NODE_ENV = process.env.NODE_ENV;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const DEMO = process.env.DEMO && process.env.DEMO === 'true';
const DEV = process.env.NODE_ENV === 'development';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
const JWT_SECRET = process.env.JWT_SECRET;
const SESSION_EXPIRY = process.env.SESSION_EXPIRY;

exports.WHITELISTED_DOMAINS = WHITELISTED_DOMAINS;
exports.NODE_ENV = NODE_ENV;
exports.COOKIE_SECRET = COOKIE_SECRET;
exports.DEMO = DEMO;
exports.DEV = DEV;
exports.REFRESH_TOKEN_SECRET = REFRESH_TOKEN_SECRET;
exports.REFRESH_TOKEN_EXPIRY = REFRESH_TOKEN_EXPIRY;
exports.JWT_SECRET = JWT_SECRET;
exports.SESSION_EXPIRY = SESSION_EXPIRY;
