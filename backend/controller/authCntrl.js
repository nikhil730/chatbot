const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: `User Already Exist`, success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(200).send({ message: `Registred Succesfully`, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in Register Controller ${error.message}`,
    });
  }
};

//login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: `User Not Found`, success: false });
    }
    //const passMatch = await bcrypt.compare(req.body.password, user.password);
    const passMatch = req.body.password;
    if (passMatch !== user.password) {
      return res
        .status(200)
        .send({ message: `Invalid Email or Password`, success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({
      message: "Login Success",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Error in Login Controller ${error.message}`,
    });
  }
};
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: `User Not Found`, success: false });
    } else {
      console.log(user);
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Auth Error ${error.message}`,
    });
  }
};
module.exports = {
  authController,
  registerController,
  loginController,
};
