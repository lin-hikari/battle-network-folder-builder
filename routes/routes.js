const express = require("express");
const { param, body } = require("express-validator");

const controller = require("../controllers/controller");
const User = require("../models/user");

const router = express.Router();

router.post(
  "/signup-user",
  [
    body("username")
      .not()
      .isEmpty()
      .trim()
      .custom(async (value) => {
        const user = await User.findOne({ username: value });
        if (user) {
          throw new Error("Username already in use!");
        }
      }),
    body("email")
      .isEmail()
      .withMessage("Invalid email!")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error("E-mail already in use!");
        }
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 6 }),
  ],
  controller.signupUser
);

//login user

//delete user?

router.post("/create-folder", controller.createFolder); //adjust this to apply user (on controller ofc)

//delete folder

router.get(
  "/get-folder/:folderId",
  [param("folderId").trim().isLength({ min: 24, max: 24 })],
  controller.getFolder
);

router.put("/add-chip-to-folder", controller.addChipToFolder);

router.put("/remove-chip-from-folder", controller.removeChipFromFolder);

module.exports = router;
