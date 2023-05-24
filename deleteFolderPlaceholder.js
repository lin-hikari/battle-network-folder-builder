exports.deleteFolder = async (req, res, next) => {
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
