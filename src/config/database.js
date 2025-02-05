const mongoose = require("mongoose")

const database = async (params) => {
 return  await mongoose.connect("mongodb+srv://vishnuna26:PVBqenVjqkvGkM2u@cluster0.n7dyk.mongodb.net/devTinder")
}

module.exports = database


