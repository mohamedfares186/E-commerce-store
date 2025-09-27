import User from "../../users/models/users.model.mjs";
import crypto from "crypto";
import { logger } from "../../../middleware/logger.mjs";

const emailVerification = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerifiedToken: hashedToken,
      emailVerifyExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ Error: "Invalid or Expired token" });

    user.emailVerified = true;
    user.emailVerifiedToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();

    return res
      .status(200)
      .json({ Message: "Email has been verified successfully" });
  } catch (error) {
    logger.error("Error sending verification email: ", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default emailVerification;
