import crypto from "crypto";

// Generate csrf tokens
const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// verify csrf token
const verifyCsrfToken = (req, res, next) => {
  const token = req.headers["x-csrf-token"] || req.headers["X-CSRF-TOKEN"];
  const cookieToken = req.cookies["X-CSRF-TOKEN"];

  if (!token) return res.status(403).json({ error: "CSRF token is required" });

  if (!cookieToken)
    return res.status(403).json({ error: "CSRF cookie is missing" });

  if (token !== cookieToken)
    return res.status(403).json({ error: "Invalid CSRF token" });

  // Validate token format (hexadecimal, 64 characters)
  const tokenRegex = /^[a-f0-9]{64}$/i;
  if (!tokenRegex.test(token) || !tokenRegex.test(cookieToken)) {
    return res.status(403).json({
      error: "Invalid CSRF token format",
      code: "CSRF_TOKEN_INVALID_FORMAT",
    });
  }

  // Constant-time comparison to prevent timing attacks
  if (
    !crypto.timingSafeEqual(
      Buffer.from(token, "hex"),
      Buffer.from(cookieToken, "hex")
    )
  ) {
    return res.status(403).json({
      error: "Invalid CSRF token",
      code: "CSRF_TOKEN_MISMATCH",
    });
  }

  next();
};

export { generateCsrfToken, verifyCsrfToken };
