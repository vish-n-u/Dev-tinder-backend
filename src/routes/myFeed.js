const express = require("express");
const mongoose = require("mongoose");
const feedRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

feedRouter.get("/feed/:page", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const hiddenUsersId = new Set();
    const requestSentOrRecievedToLoggedInUser =
      await ConnectionRequestModel.find({
        $or: [
          {
            fromUserId: loggedInUser._id,
          },
          {
            toUserId: loggedInUser._id,
          },
        ],
      }).select("fromUserId toUserId");

    requestSentOrRecievedToLoggedInUser.map((id) => {
      hiddenUsersId.add(id);
    });

    const myFeedUsers = await User.find({
      $and: [
        {
          _id: { $nin: new Array(hiddenUsersId) },
        },
        { _id: { $ne: [loggedInUser._id] } },
      ],
    });

    console.log("allUsers==>", myFeedUsers);

    return res.status(200).send({  data:myFeedUsers });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ message: "server error" });
  }
});

module.exports = feedRouter;
