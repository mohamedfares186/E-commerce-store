import User from "../../users/models/users.model.mjs";
import bcrypt from "bcryptjs";

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    const { newPassword, repeatPassword } = req.body;
    if (!newPassword || !repeatPassword)
      return res.status(400).json({ Error: "Password fields are required" });
    if (newPassword !== repeatPassword)
      return res.status(400).json({ Error: "Please Enter a valid password" });
    if (repeatPassword.length < 8)
      return res
        .status(400)
        .json({ Error: "Password must be at least 8 characters long" });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ Error: "Invalid token" });

    const matchPasswords = await bcrypt.compare(repeatPassword, user.password);
    if (matchPasswords)
      return res.status(400).json({ Error: "Invalid Password" });

    const hashedPassword = await bcrypt.hash(repeatPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    return res
      .status(201)
      .json({ Message: "Password has been set successfully" });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export default resetPassword;
