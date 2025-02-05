const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password!");
  }
};

const validateProfileData = (userObj)=>{
  const allowedFields = ["firstName","lastName","email","age","gender","photoUrl","skills","about"]

  const onlyIncludesAllowFields = Object.keys(userObj).every((elem)=>allowedFields.includes(elem))
  return onlyIncludesAllowFields

}

module.exports = {
  validateSignUpData,
  validateProfileData
};