const bcrypt = require("bcrypt");
const User = require("../Schema/UserSchema");

const ForgotPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Checks if a user with the provided email exists
    const user = await User.findOne({ email });

    if (user) {
      // Hash the new password before updating it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res
        .status(404)
        .json({ message: "No user found with this email address" });
    }
  } catch (error) {
    // Handles unexpected errors
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = ForgotPassword;
