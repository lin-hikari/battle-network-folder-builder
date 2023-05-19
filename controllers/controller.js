const Chip = require("../models/chip");
const Folder = require("../models/folder");

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

// exports.getChips = (req, res, next) => {
//     res.status(200).json({
//         chips:[{name: 'Cannon', desc: 'Cannon for attacking 1 enemy', dmg: 50}]
//     });
// };

// exports.addChip = async (req, res, next) => {
//     const number = req.body.number;
//     const name = req.body.name;
//     const description = req.body.description;
//     const damage = req.body.damage;

//     const chip = new Chip({
//         number: number,
//         name: name,
//         description: description,
//         damage: damage
//     });

//     try{
//         await chip.save();
//         res.status(201).json({
//             message: 'Chip created successfully!',
//             chip: chip,
//         });
//     } catch (err) {
//         if (!err.statusCode) {
//           err.statusCode = 500;
//         }
//         next(err);
//     }
// }
