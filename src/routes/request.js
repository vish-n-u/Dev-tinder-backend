const express = require("express");

const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user")

/**
 * @swagger
 * /request/send/{status}/{toUserId}:
 *   post:
 *     summary: Send a connection request to a user with a specified status.
 *     tags:
 *       - Connection Requests
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [interested, ignored]
 *         description: The status of the connection request (e.g., "interested" or "ignored").
 *       - in: path
 *         name: toUserId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to whom the connection request is being sent.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {}
 *     responses:
 *       200:
 *         description: Connection request successfully sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "request sent"
 *       400:
 *         description: Bad request due to invalid status, user not found, or duplicate request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "invalid status type : "
 *                 status:
 *                   type: string
 *                   example: "ignored"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "internal server err"
 */


requestRouter.get(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      let allowedStatus = ["interested","ignored"]

      console.log("inside Here ")

      if(!allowedStatus.includes(status)){
        return res.status(400).send({message:"invalid status type : ",status})
      }

      const doesUserExist = await  User.findById(toUserId)

      if(!doesUserExist){
        return res.status(400).send({message:"User already exist"})
      }

   const doesRequestAlreadyExist = await  ConnectionRequestModel.findOne({
        $or:[
            {
                fromUserId,toUserId
            },
            {
                fromUserId:toUserId,toUserId:fromUserId
            },
        ]
      })
      console.log("doesRequestAlreadyExist==>",doesRequestAlreadyExist)

      if(doesRequestAlreadyExist){
        return res.status(400).send({message:"reqquest is already made"})
      }

      const newRequestConnection = await ConnectionRequestModel.create({
        fromUserId,
        toUserId,
        status,
      });

      const data  = await newRequestConnection.save()
      res.status(200).send({ message: "request sent" });
    } catch (e) {
      return res.status(500).send({ message: "internal server err" });
    }
  }
);

requestRouter.get(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);


module.exports = requestRouter