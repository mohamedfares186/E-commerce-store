// Environment variables configuration
const env = {
  env: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost",
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  accessTokenExpire: process.env.ACCESS_TOKEN_EXPIRE || 1000 * 60 * 15, // Default 15 minutes
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenExpire: process.env.REFRESH_TOKEN_EXPIRE || 1000 * 60 * 60 * 24, // Default 1 day
  emailVerificationTokenSecret: process.env.EMAIL_VERIFICATION_TOKEN_SECRET,
  resetPasswordTokenSecret: process.env.RESET_PASSWORD_TOKEN_SECRET,
  csrfTokenSecret: process.env.CSRF_TOKEN_SECRET,
  csrfTokenExpire: process.env.CSRF_TOKEN_EXPIRE || 1000 * 60 * 15, // Default 15 minutes
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  facebookAppId: process.env.FACEBOOK_APP_ID,
  facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
};

export default env;
