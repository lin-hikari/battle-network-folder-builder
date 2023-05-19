const express = require("express");

const testController = require("../controllers/test");

const router = express.Router();

router.post("/create-folder", testController.createFolder);

router.post("/add-chip-to-folder", testController.addChipToFolder);

router.post("/remove-chip-from-folder", testController.removeChipFromFolder);

//router.get('/chips', testController.getChips);

//router.post('/chips', testController.addChip);

module.exports = router;
