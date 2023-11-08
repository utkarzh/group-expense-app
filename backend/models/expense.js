const sequelize = require("../util/database");
const Sequelize = require("sequelize");
const Expense = sequelize.define("Expense", {
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  category: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Expense;
