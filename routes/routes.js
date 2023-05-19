const express = require("express");
const { param } = require("express-validator");

const controller = require("../controllers/controller");

const router = express.Router();

router.post("/create-folder", controller.createFolder);

router.get(
  "/get-folder/:folderId",
  [param("folderId").trim().isLength({ min: 24, max: 24 })],
  controller.getFolder
);

router.post("/add-chip-to-folder", controller.addChipToFolder);

router.post("/remove-chip-from-folder", controller.removeChipFromFolder);

//router.get('/chips', testController.getChips);

//router.post('/chips', testController.addChip);

module.exports = router;
