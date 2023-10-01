const jwt = require("jsonwebtoken");

const UserSignData = require("../models/UserModel");

exports.Authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    // console.log(token)
    const tokenVarify = jwt.verify(token, process.env.ENV_SECRET);
    // console.log(tokenVarify);
    if (tokenVarify.userId == null || tokenVarify.name == null) {
      throw new Error("somthing went wrong");
    }
    userdata = await UserSignData.findByPk(tokenVarify.id);
    // console.log(JSON.stringify(getuserdata));
    req.userdata = userdata;
    next();
  } catch (err) {
    // console.log(err)
    return res
      .status(401)
      .json({ success: false, message: "User doesnot Exist" });
  }
};
