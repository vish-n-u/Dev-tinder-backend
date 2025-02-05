const express = require("express");
const ProfileRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const { validateProfileData } = require("../utils/validation");
/**
 * @swagger
 * /profile/view:
 *   get:
 *     summary: Retrieve user profile information
 *     description: Returns the profile data for the currently authenticated user
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique identifier for the user
 *                   example: "507f1f77bcf86cd799439011"
 *                 email:
 *                   type: string
 *                   description: User's email address
 *                   example: "user@example.com"
 *                 firstName:
 *                   type: string
 *                   description: User's first name
 *                   example: "John"
 *                 lastName:
 *                   type: string
 *                   description: User's last name
 *                   example: "Doe"
 *                 gender:
 *                   type: string
 *                   description: User's Gender
 *                   example: "Male"
 *                 skills:
 *                   type: array
 *                   description: User's skills
 *                   example: ["React","Frontend System Design"]
 *                 about:
 *                   type: string
 *                   description: User's info
 *                   example: "MEEE"
 *                 photoUrl:
 *                   type: string
 *                   description: User's image
 *                   example: "MEEE"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Account creation timestamp
 *                   example: "2023-01-01T00:00:00.000Z"
 *       400:
 *         description: Bad request or error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "ERROR : Invalid user data"
 *       401:
 *         description: Unauthorized - User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Authentication error message
 *                   example: "Authentication required"
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

ProfileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

ProfileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!validateProfileData(req.body)) {
      throw new Error("invalid Edit requests");
    }
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save()
    res.status(200).send({
      message:
      "Edit sucessfully",
    data : loggedInUser
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = ProfileRouter;
