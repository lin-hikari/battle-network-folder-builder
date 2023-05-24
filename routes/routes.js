const express = require("express");
const { param, body } = require("express-validator");

const controller = require("../controllers/controller");
const User = require("../models/user");
const { authCheck } = require("../middleware/auth-check");

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

router.post("/login-user", controller.loginUser);

router.delete("/delete-user", authCheck, controller.deleteUser);

router.post("/create-folder", authCheck, controller.createFolder);

router.delete("/delete-folder", authCheck, controller.deleteFolder);

router.get(
  "/view-folder/:folderId",
  [param("folderId").trim().isLength({ min: 24, max: 24 })],
  controller.viewFolder
);

router.put("/add-chip-to-folder", authCheck, controller.addChipToFolder);

router.put(
  "/remove-chip-from-folder",
  authCheck,
  controller.removeChipFromFolder
);

module.exports = router;
