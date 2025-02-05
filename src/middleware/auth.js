const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config(); 

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log("token==>",token)
    if (!token) {
      return res.status(401).send("Please Login!");
    }

    console.log(" process.env.JWT_KEY==>", process.env.JWT_KEY)
    const decodedObj = await jwt.verify(token, process.env.JWT_KEY);

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    console.log("called next")
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {userAuth}