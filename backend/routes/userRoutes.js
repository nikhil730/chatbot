const express = require("express");
const {
  loginController,
  registerController,
  authController,
} = require("../controller/authCntrl");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
router.post("/login", loginController);

//register
router.post("/register", registerController);

//Auth api
router.post("/getUserData", authMiddleware, authController);
module.exports = router;
