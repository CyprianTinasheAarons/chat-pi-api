const authJwt = require("../middleware/authJwt");
const db = require("../models");
const User = db.users;
const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const QRCode = require("qrcode");
const speakeasy = require("speakeasy");

sgMail.setApiKey(
  "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"
);

// https://new-coindraw-main.vercel.app

function sendWelcomeEmail(email, token) {
  const msg = {
    to: email,
    from: "welcome@coindraw.io", // Replace with your own email address
    subject: "Welcome to Coindraw!",
    text: "We are delighted you have chosen to join our passionate and global community.",
    html:
      '<p>We are delighted you have chosen to join our passionate and global community.</p> <p>Please click here to verify your email address</p><a href="https://new-coindraw-main.vercel.app/verify/' +
      email +
      "?token=" +
      token +
      '">Verify Email</a> <p>As a welcome to our new Members, you can receive a complimentary lootbot spin in our Discord. The prize could be a free entry into our Classic draw!</p> <p>Should you require any further support or assistance, please do not hesitate to contact us on Discord or by email at info@coindraw.io</p> <p>Alternatively, we encourage you to explore our website to discover more about the project and what competitions we are running at the moment.</p><p>Best wishes & Good luck!</p><p>Coindraw</p>',
  };
  sgMail.send(msg);
}

function sendVerificationEmail(email) {
  const msg = {
    to: email,
    from: "noreply@coindraw.io", // Replace with your own email address
    subject: "Verified your email address.",
    text: "Successfully verified your email address.",
    html: "<p>Successfully verified your email address.</p>",
  };
  sgMail.send(msg);
}

exports.signup = (req, res) => {
  //generate email verification token
  const emailToken = crypto.randomBytes(64).toString("hex");

  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    walletAddress: req.body.walletAddress,
    phoneNumber: req.body.phoneNumber,
    avatar: req.body.avatar,
    experience: req.body.experience,
    password: bcrypt.hashSync(req.body.password, 8),
    custodialWallet: req.body.custodialWallet,
    emailVerificationToken: emailToken,
    role: req.body.role,
    isVerified: false,
    referralCode: req.body.referralCode,
    reffered: req.body.reffered,
  })
    .then((user) => {
      res.status(200).send({ user: user });
      sendWelcomeEmail(user.email, emailToken);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      let token = authJwt.signToken(user._id, user.role);

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
        role: user.role,
        custodialWallet: user.custodialWallet,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.verify = (req, res) => {
  const email = req.params.email;
  const token = req.body.token;

  User.findOne({ email: email })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update User with email=${email}. Maybe User was not found!`,
        });
      } else {
        if (data.emailVerificationToken !== token) {
          res.status(404).send({
            message: `Cannot update User with email=${email}. Maybe User was not found!`,
          });
        } else {
          data.emailVerificationToken = null;
          data.isVerified = true;
          data.save();
          sendVerificationEmail(data.email);
          res.send({ message: "User was updated successfully." });
        }
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with email=" + email,
      });
    });
};

//implementation of password reset functionality

exports.resetPassword = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      // Generate a password reset token
      const token = crypto.randomBytes(20).toString("hex");

      // Set the token and expiration date on the user object
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      // Save the user object
      user.save();

      // Send the password reset email
      const resetUrl = `https://new-coindraw-main.vercel.app/reset/${token}`;
      sgMail.send({
        to: user.email,
        from: "no-reply@coindraw.io", // Replace with your own email address
        subject: "Password Reset Request",
        text: `Someone has requested to change your password. You can do this through the link below.\n ${resetUrl}`,
        html: `<p>Someone has requested to change your password. You can do this through the link below.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this change, please ignore this email. Your password won't change until you access the link above and create a new one.</p>`,
      });

      // Send a success response
      res.status(200).send({ message: "Password reset email sent." });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.resetPasswordToken = (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Password reset token is invalid or has expired." });
      }

      res.status(200).send({ message: "Password reset token is valid." });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.resetPasswordPostToken = (req, res) => {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Password reset token is invalid or has expired." });
      }

      // Update the user's password
      user.password = bcrypt.hashSync(req.body.password, 8);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      // Save the user object
      user.save();

      // Send a success response
      res.status(200).send({ message: "Password has been reset." });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.adminLogin = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      if (user.role !== "admin") {
        return res.status(404).send({ message: "User not Allowed Access." });
      }

      if (user.twoFactorSecret === undefined) {
        // Generate a secret key for the user
        const secret = speakeasy.generateSecret({ length: 20 });

        // Save the secret key to the user object
        user.twoFactorSecret = secret.base32;

        // Save the user object
        user.save();

        // Generate a QR code for the user to scan with their 2FA app
        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
          if (err) {
            return res.status(500).send({ message: err.message });
          }

          // Send the QR code image and a success response
          res.status(200).send({ dataUrl: data_url });
        });
      } else {
        // Verify the 2FA code provided by the user
        return res.status(200).send({ message: "2FA is already enabled." });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.admin2fa = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      if (user.role !== "admin") {
        return res.status(404).send({ message: "User not Allowed Access." });
      }

      // Verify the 2FA code provided by the user
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: req.body.token,
      });

      if (verified) {
        // Generate an access token for the user

        let token = authJwt.signToken(user._id, user.role);

        res.status(200).send({ accessToken: token });
      } else {
        res.status(401).send({ message: "Invalid 2FA code." });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
