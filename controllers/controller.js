const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const Chip = require("../models/chip");
const Folder = require("../models/folder");
const User = require("../models/user");
const secretKey = require("../utility/jwt-secret-key");

exports.signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Invalid data!");
    err.statusCode = 422;
    err.data = errors.array();
    return next(err);
  }

  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      username: username,
      email: email,
      password: hashedPw,
    });
    const result = await user.save();
    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  //let loadedUser;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      const err = new Error("User not found!");
      err.statusCode = 401;
      throw err;
    }
    //loadedUser = user;
    const isPasswordRight = await bcrypt.compare(password, user.password);
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
      secretKey,
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

exports.createFolder = async (req, res, next) => {
  const newFolder = new Folder({
    name: req.body.name,
    description: req.body.description,
  });

  try {
    await newFolder.save();
    res.status(201).json({
      message: "Folder created successfully!",
      newFolder: newFolder,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getFolder = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Folder ID format is invalid.");
    err.statusCode = 422;
    return next(err);
  }

  const folderId = req.params.folderId;
  const folder = await Folder.findById(folderId).populate("chips");
  try {
    if (!folder) {
      const error = new Error("Could not find folder.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Folder found!", folder: folder });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addChipToFolder = async (req, res, next) => {
  const folderId = req.body.folderId;
  const chipNum = req.body.chipNum;

  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      const error = new Error("Folder not found!");
      error.statusCode = 404;
      throw error;
    }

    const chip = await Chip.findOne({ number: chipNum });
    if (!chip) {
      const error = new Error("Chip not found!");
      error.statusCode = 404;
      throw error;
    }

    const folderFull = folder.chips.length >= 30;
    if (folderFull) {
      const error = new Error("Folder is already full!");
      error.statusCode = 400;
      throw error;
    }

    folder.chips.push(chip);
    const result = await folder.save();
    res.status(200).json({ message: "Chip added to folder!", folder: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.removeChipFromFolder = async (req, res, next) => {
  const folderId = req.body.folderId;
  const chipNum = req.body.chipNum;

  try {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      const error = new Error("Folder not found!");
      error.statusCode = 404;
      throw error;
    }

    const chip = await Chip.findOne({ number: chipNum });
    if (!chip) {
      const error = new Error("Chip not found!");
      error.statusCode = 404;
      throw error;
    }

    const isThereChip = folder.chips.includes(chip._id);
    if (!isThereChip) {
      const error = new Error("Chip not found in folder!");
      error.statusCode = 404;
      throw error;
    }

    folder.chips.pull(chip);
    const result = await folder.save();
    res
      .status(200)
      .json({ message: "Chip removed from folder!", folder: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
