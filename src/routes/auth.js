// routes/auth.js
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - emailId
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         emailId:
 *           type: string
 *         password:
 *           type: string
 *         gender:
 *           type: string
 *         photoUrl:
 *           type: string
 *         skills:
 *           type: array
 *         about:
 *           type: string
 *       
 *          
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     tags: [Authentication]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 */
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password,age } = req.body;
    console.log("firstName, lastName, emailId, password,age",firstName, lastName, emailId, password,age)
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Authentication]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       404:
 *         description: User not found or invalid password
 *       500:
 *         description: Server error
 */
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({
      emailId: emailId, // Fixed: changed email to emailId to match schema
    });
    
    if (!user) {
      return res.status(404).send("Invalid User");
    }
    
    const isPasswordCorrect = await user.validatePassword(password);
    if (!isPasswordCorrect) {
      return res.status(404).send("Invalid Password");
    }
    
    const token = await user.getJWT(); // Added missing await
    
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    
    res.status(200).send("Login successful");
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
});

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logs out the user
 *     description: Clears the token cookie and expires it to log out the user.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully logged out"
 *       
 */
authRouter.get("/logout",async(req,res)=>{
  res.cookie("token",null,{
    expires:new Date(Date.now())
  }).send().status(200)
})

module.exports = authRouter;