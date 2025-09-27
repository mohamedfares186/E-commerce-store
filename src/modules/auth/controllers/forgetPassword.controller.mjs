import User from "../../users/models/users.model.mjs";
import { generateTokens } from "../../../utils/generateTokens.mjs";
import sendEmail from "../../../utils/sendEmails.mjs";
import sanitize from "../../../utils/sanitize.mjs";
import { logger } from "../../../middleware/logger.mjs";

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Sanitize email input
    const sanitizedEmail = sanitize(email);

    if (!sanitizedEmail)
      return res.status(400).json({ Error: "Email is required" });

    const user = await User.findOne({ email: sanitizedEmail });
    if (!user) return res.status(404).json({ Error: "User Not Found" });

    const { token, hashedToken } = generateTokens();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.save();
    const resetLink = `http://localhost:3000/api/auth/reset-password/${token}`;
    await sendEmail(
      sanitizedEmail,
      "Password Reset",
      `Click the link to reset your password ${resetLink}`
    );

    return res
      .status(200)
      .json({ message: "Password reset link sent to your email" });
  } catch (error) {
    logger.error("Error forget user: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default forgetPassword;
