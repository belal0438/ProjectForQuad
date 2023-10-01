const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const CustomerData = sequelize.define("Customer", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  imageurl: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  totalorder: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = CustomerData;
