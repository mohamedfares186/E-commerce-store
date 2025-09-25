import User from "../../users/models/users.model.mjs";
import crypto from "crypto";

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
    console.error(error);
    return res.sendStatus(500);
  }
};

export default emailVerification;
