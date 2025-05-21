const User = require("../models/user.js");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

module.exports.renderSignupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    // console.log(registerUser);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  req.flash("success", "You are logged out");
  res.redirect("/listings");
};
// Forgot Password
module.exports.renderForgotForm = (req, res) => {
  res.render("./users/forgot.ejs");
};
module.exports.forgot = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // console.log(user);
  if (user == null) {
    req.flash("error", "Invalid email address");
    res.redirect("/reset");
  } else {
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

const resetUrl = `${process.env.BASE_URL}/reset-password/${token}`;
    // Send email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD, 
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset",
      html: `<p>You requested a password reset</p>
           <p><a href="${resetUrl}">Click here</a> to reset password</p>`,
    });
    req.flash("success", "Password reset email sent.✅");
    res.redirect("/login");
  }
};

module.exports.renderResetPasswordForm = (req, res) => {
  res.render("./users/reset", { token: req.params.token });
};

module.exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "Invalid or expired token");
    return res.redirect("/listings");
  }

  // Use the setPassword method provided by passport-local-mongoose
  user.setPassword(newPassword, async (err, userWithUpdatedPassword) => {
    if (err) return res.status(500).json({ message: "Error setting password" });

    // Clear the reset token fields
    userWithUpdatedPassword.resetToken = undefined;
    userWithUpdatedPassword.resetTokenExpiry = undefined;

    await userWithUpdatedPassword.save();

    req.flash("success", "Password has been reset successfully!");
    res.redirect("/login");
  });
};
