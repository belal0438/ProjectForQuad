const express = require("express");

const router = express.Router();

const CustomerControllers = require("../controllers/CustomerController");
const Authorization = require("../Authentication/Auth");

router.post(
  "/insert",
  Authorization.Authenticate,
  CustomerControllers.CustomerPostData
);
router.put(
  "/update",
  Authorization.Authenticate,
  CustomerControllers.CustomerUpdateData
);

router.get("/details/:user_id", CustomerControllers.GetDetailDataByUserId);
router.get("/image/:user_id", CustomerControllers.GetImageByUserId);
router.delete("/delete/:user_id", CustomerControllers.DeleteDetailByUserId);

module.exports = router;
