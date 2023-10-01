const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const sequelize = require("../util/database");

function IsStringIsValid(str) {
  if (str == undefined || str.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.UserPostData = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, password } = req.body;
    // console.log(req.body);
    const id = uuid.v4();
    if (
      IsStringIsValid(email) ||
      IsStringIsValid(password) ||
      IsStringIsValid(name)
    ) {
      return res.status(401).json({ Error: ".somthing is missing" });
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.log(err);
      }
      console.log("password", hash);
      await User.create({ id: id, name: name, email: email, password: hash });
    });
    await t.commit();
    res.status(201).json({ message: `Sign in succefully` });
  } catch (error) {
    await t.rollback();
    res.status(500).json(error);
  }
};

// login functionality

function generateAccesKey(email, name) {
  return jwt.sign({ email: email, name: name }, process.env.ENV_SECRET, {
    expiresIn: "24h",
  });
}

exports.LoginPostData = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email, password } = req.body;
    // console.log(req.body);
    if (IsStringIsValid(email) || IsStringIsValid(password)) {
      return res
        .status(400)
        .json({ success: false, message: "Email id or Password is incorrect" });
    }

    let LoginData = await User.findAll({ where: { email: email } });
    // console.log(LoginData);
    if (LoginData.length > 0) {
      bcrypt.compare(password, LoginData[0].password, async (err, result) => {
        if (err) {
          throw new Error("somthing went wrong");
        }
        if (result == true) {
          await t.commit();

          return res.status(200).json({
            success: true,
            message: "User logged in succesfull",
            token: generateAccesKey(LoginData[0].password, LoginData[0].name),
          });
        } else {
          await t.rollback();
          return res
            .status(400)
            .json({ success: false, message: "Password is incorrect" });
        }
      });
    } else {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: "User doesnot Exist" });
    }
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      message: err,
      success: false,
    });
  }
};
