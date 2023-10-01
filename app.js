const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const app = express();
app.use(cors());

const sequelize = require("./util/database");
const bodyParser = require("body-parser");

const UserRouter = require("./router/UserRouter");
const CustomerRouter = require("./router/CustomerRouter");
app.use(bodyParser.json());
app.use(UserRouter);
app.use(CustomerRouter);

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    app.listen(3000, () => {
      console.log("database connected");
    });
  })
  .catch((err) => console.log(err));
