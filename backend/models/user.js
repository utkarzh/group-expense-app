const sequelize = require("../util/database");
const Sequelize = require("sequelize");
const User = sequelize.define("User", {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
module.exports = User;
