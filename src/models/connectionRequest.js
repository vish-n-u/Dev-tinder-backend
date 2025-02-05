const mongoose = require("mongoose")


const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        enum:{
            values:["accepted","rejected","interested","ignored"],
            message:"{VALUE} is incorrect ststus type"
        },
        required:true
    },
    
},{timestamps:true})

const ConnectionRequestModel = mongoose.model("ConnectionRequest",ConnectionRequestSchema)

module.exports = ConnectionRequestModel