const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { ObjectId } = require("bson");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");

const Folder = require("../models/folder");
const User = require("../models/user");

sgMail.setApiKey(process.env.SENDGRIP_API_KEY);

exports.signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Invalid data!");
    err.statusCode = 422;
    err.data = errors.array();
    return next(err);
  }

  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 12),
      authentication: {
        token: await crypto.randomBytes(32).toString("hex"),
        expiration: Date.now() + 86400000, //86400000ms = 1 day
      },
    });
    const result = await user.save();

    // since the backend is not hosted for now, you get the raw token here, instead of a link
    const msg = {
      to: req.body.email,
      from: process.env.SENDER_EMAIL,
      subject: "Account Verification for BN Folder Builder",
      text:
        "Here's your token to verify your account: " +
        user.authentication.token,
      html: `
        <p>Here's your token to verify your account: ${user.authentication.token}</p>
      `,
    };
    sgMail.send(msg);

    res.status(201).json({
      message: "User created and verification email being sent!",
      userId: result._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      "authentication.token": req.params.token,
      "authentication.expiration": { $gt: Date.now() },
    });
    if (!user) {
      const err = new Error("Invalid token!");
      err.statusCode = 400;
      throw err;
    }

    user.authentication.verified = true;
    user.authentication.token = null;
    user.authentication.expiration = null;
    await user.save();
    res.status(200).json({ message: "User verified!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  let user;
  if (req.body.username)
    user = await User.findOne({ username: req.body.username });
  else if (req.body.email) user = await User.findOne({ email: req.body.email });

  try {
    if (!user) {
      const err = new Error("User not found!");
      err.statusCode = 401;
      throw err;
    }

    if (!user.authentication.verified) {
      const err = new Error("User not verified!");
      err.statusCode = 401;
      throw err;
    }

    const isPasswordRight = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordRight) {
      const err = new Error("Wrong password!");
      err.statusCode = 401;
      throw err;
    }

    const token = jwt.sign(
      {
        username: user.username,
        userId: user._id.toString(),
      },
      process.env.JWT_KEY,
      { expiresIn: "30d" }
    );
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error("User not found!");
      err.statusCode = 400;
      throw err;
    }

    await User.findByIdAndDelete(req.userId);
    await Folder.deleteMany({ creator: new ObjectId(req.userId) });
    res.status(200).json({ message: "User deleted!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
