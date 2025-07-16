const expressRateLimit = require("express-rate-limit");

const limitAccess = expressRateLimit({
  windowMs: 60 * 1000,
  limit: 10,
});

module.exports = limitAccess;
