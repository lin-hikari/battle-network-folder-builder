const { validationResult } = require("express-validator");

const Chip = require("../models/chip");
const Folder = require("../models/folder");
const User = require("../models/user");

exports.createFolder = async (req, res, next) => {
  const newFolder = new Folder({
    name: req.body.name,
    description: req.body.description,
    creator: req.userId,
  });

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error("User not found!");
      err.statusCode = 400;
      throw err;
    }

    const folderLimit = user.folders.length >= 10;
    if (folderLimit) {
      const err = new Error("Max number of folders reached!");
      err.statusCode = 400;
      throw err;
    }

    await newFolder.save();
    user.folders.push(newFolder);
    await user.save();

    res.status(201).json({
      message: "Folder created successfully!",
      newFolder: newFolder,
    });
    return user;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteFolder = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error("User not found!");
      err.statusCode = 400;
      throw err;
    }

    const folder = await Folder.findById(req.body.folderId);
    if (!folder) {
      const err = new Error("Folder not found!");
      err.statusCode = 404;
      throw err;
    }

    if (folder.creator.toString() !== req.userId) {
      const err = new Error("Folder does not belong to user!");
      err.statusCode = 401;
      throw err;
    }

    await Folder.findByIdAndDelete(req.body.folderId);
    user.folders.pull(req.body.folderId);
    await user.save();
    res.status(200).json({ message: "Folder deleted!" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.viewFolder = async (req, res, next) => {
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

exports.downloadFolder = async (req, res, next) => {
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

    res.setHeader(
      "Content-disposition",
      "attachment; filename=" + folder.name + ".json"
    );
    res.setHeader("Content-type", "application/json");
    res.write(JSON.stringify(folder.toJSON()), function (err) {
      res.end();
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addChipToFolder = async (req, res, next) => {
  try {
    const folder = await Folder.findById(req.body.folderId);
    if (!folder) {
      const err = new Error("Folder not found!");
      err.statusCode = 404;
      throw err;
    }

    if (folder.creator.toString() !== req.userId) {
      const err = new Error("Folder does not belong to user!");
      err.statusCode = 401;
      throw err;
    }

    const chip = await Chip.findOne({ number: req.body.chipNum });
    if (!chip) {
      const err = new Error("Chip not found!");
      err.statusCode = 404;
      throw err;
    }

    const folderFull = folder.chips.length >= 30;
    if (folderFull) {
      const err = new Error("Folder is already full!");
      err.statusCode = 400;
      throw err;
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
  try {
    const folder = await Folder.findById(req.body.folderId);
    if (!folder) {
      const error = new Error("Folder not found!");
      error.statusCode = 404;
      throw error;
    }

    if (folder.creator.toString() !== req.userId) {
      const err = new Error("Folder does not belong to user!");
      err.statusCode = 401;
      throw err;
    }

    const chip = await Chip.findOne({ number: req.body.chipNum });
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
