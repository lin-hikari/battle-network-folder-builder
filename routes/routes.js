const express = require("express");
const { param, body } = require("express-validator");

const userController = require("../controllers/user-controller");
const folderController = require("../controllers/folder-controller");
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
  userController.signupUser
);

router.put("/verify-user/:token", userController.verifyUser);

router.post("/login-user", userController.loginUser);

router.delete("/delete-user", authCheck, userController.deleteUser);

router.post("/create-folder", authCheck, folderController.createFolder);

router.delete("/delete-folder", authCheck, folderController.deleteFolder);

router.get(
  "/view-folder/:folderId",
  [param("folderId").trim().isLength({ min: 24, max: 24 })],
  folderController.viewFolder
);

router.get(
  "/download-folder/:folderId",
  [param("folderId").trim().isLength({ min: 24, max: 24 })],
  folderController.downloadFolder
);

router.put("/add-chip-to-folder", authCheck, folderController.addChipToFolder);

router.put(
  "/remove-chip-from-folder",
  authCheck,
  folderController.removeChipFromFolder
);

module.exports = router;
