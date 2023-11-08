const express = require("express");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const groupRoutes = require("./routes/group");
const sequelize = require("./util/database");
const User = require("./models/user");
const Expense = require("./models/expense");
const GroupMember = require("./models/groupmember");
const Group = require("./models/group");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/user", userRoutes);
app.use("/groups", groupRoutes);

app.use("/expense", expenseRoutes);
sequelize
  .sync({ force: true })
  .then((_) => {
    app.listen(process.env.PORT || 3500);
  })
  .catch((err) => {
    console.log(err);
  });

User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });
GroupMember.belongsTo(User);
GroupMember.belongsTo(Group);
User.hasMany(Expense);
Expense.belongsTo(User);
Group.hasMany(Expense);
Expense.belongsTo(Group);
