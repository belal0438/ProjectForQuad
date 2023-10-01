const uuid = require("uuid");
const sequelize = require("../util/database");
const bcrypt = require("bcrypt");
const CustomerModel = require("../models/CustomerModel");

function IsStringIsValid(str) {
  if (str == undefined || str.length === 0) {
    return true;
  } else {
    return false;
  }
}

exports.CustomerPostData = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, password, ImageUrl, TotalOrder } = req.body;
    // console.log(req.body);
    const id = uuid.v4();
    if (
      IsStringIsValid(email) ||
      IsStringIsValid(password) ||
      IsStringIsValid(name) ||
      IsStringIsValid(ImageUrl) ||
      IsStringIsValid(TotalOrder)
    ) {
      return res.status(401).json({ Error: ".somthing is missing" });
    }
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.log(err);
      }
      //   console.log("password", hash);
      await CustomerModel.create({
        id: id,
        name: name,
        email: email,
        password: hash,
        imageurl: ImageUrl,
        totalorder: TotalOrder,
      });
    });
    await t.commit();
    res.status(201).json({ message: `succefully` });
  } catch (error) {
    await t.rollback();
    res.status(500).json(error);
  }
};

// get Detail by user_id

exports.GetDetailDataByUserId = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { user_id } = req.params;
    const Customer = await CustomerModel.findOne({ where: { id: user_id } });
    await t.commit();
    res.status(201).json({ message: Customer });
  } catch (error) {
    await t.rollback();
    res.status(500).json(error);
  }
};

// get Image by user_id

exports.GetImageByUserId = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { user_id } = req.params;
    const Customer = await CustomerModel.findOne({ where: { id: user_id } });
    await t.commit();
    res.status(201).json({ ImageUrl: Customer.imageurl });
  } catch (error) {
    await t.rollback();
    res.status(500).json(error);
  }
};

// Delete by user_id

exports.DeleteDetailByUserId = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { user_id } = req.params;
    const Customer = await CustomerModel.findOne({ where: { id: user_id } });
    if (Customer) {
      await Customer.destroy();
      await t.commit();
      return res
        .status(200)
        .json({ success: true, message: `Customer has been removed!` });
    } else {
      await t.rollback();
      return res
        .status(404)
        .json({ success: false, message: `User Does not Exist` });
    }
  } catch (error) {
    await t.rollback();
    res.status(500).json(error);
  }
};

// Update Data

exports.CustomerUpdateData = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, ImageUrl, TotalOrder } = req.body;
    // console.log(req.body);
    if (
      IsStringIsValid(name) ||
      IsStringIsValid(email) ||
      IsStringIsValid(ImageUrl) ||
      IsStringIsValid(TotalOrder)
    ) {
      return res.status(401).json({ Error: ".somthing is missing" });
    }

    const checkCustomer = await CustomerModel.findOne({
      where: { email: email },
    });

    // console.log(checkCustomer);

    if (!checkCustomer) {
      return res
        .status(404)
        .json({ success: false, message: `This customer not in the List` });
    }
    //   console.log("password", hash);
    await CustomerModel.update(
      {
        name: name,
        imageurl: ImageUrl,
        totalorder: TotalOrder,
      },
      { where: { email: email } }
    );
    await t.commit();
    res.status(201).json({ message: `succefully Updated` });
  } catch (error) {
    await t.rollback();
    res.status(500).json(error);
  }
};
