const express = require("express");

const router = express.Router();

const UserControllers = require("../controllers/UserController");

router.post("/users", UserControllers.UserPostData);
router.post("/login", UserControllers.LoginPostData);

module.exports = router;
