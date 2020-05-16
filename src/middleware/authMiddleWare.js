const mongoose = require("mongoose");
const jsonWebToken = require("jsonwebtoken");
const SaltOrKey = process.env.SALT_OR_KEY;

const Admin = mongoose.model("admin");

const auth = async (req, res, next) => {
  
  try {
    const userToken = req.headers.authorization.replace("Bearer ", "");
    const verifiedToken = await jsonWebToken.verify(userToken, SaltOrKey);

    const user = await Admin.findOne({
      _id: verifiedToken._id,
      "loggedIn.token": userToken,
    });

    if (!user) {
      throw new Error("Auth Error");
    }


    req.admin = user;
    req.token = userToken;
    next();
  } catch (err) {


    res.status(401).json({
      error: "not AUthorized !",
    });
  }
};

module.exports = auth;
