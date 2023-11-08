const Expense = require("../models/expense");
const GroupMember = require("../models/groupmember");
const User = require("../models/user");

exports.getAnalysis = async (req, res) => {
  const { groupId } = req.params;

  try {
    const expenses = await Expense.findAll({ where: { groupId } });

    const totalExpenses = expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );

    const groupMembers = await GroupMember.findAll({
      where: {
        groupId,
      },
    });
    const totalUsers = groupMembers.length;

    const userIds = groupMembers.map((member) => member.UserId);
    const users = await User.findAll({ where: { id: userIds } });

    const individualAmounts = {};
    for (let user of users) {
      const userExpenses = expenses.filter(
        (expense) => expense.UserId === user.id
      );

      const userTotal = userExpenses.reduce(
        (total, expense) => total + expense.amount,
        0
      );
      individualAmounts[user.username] = userTotal - totalExpenses / totalUsers;
    }

    res.status(200).json({
      success: true,
      data: {
        totalExpenses,
        individualAmounts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal error..",
    });
  }
};

exports.getExpenses = async (req, resp) => {
  const groupId = parseInt(req.params.groupId);
  try {
    const Expenses = await Expense.findAll({
      where: { GroupId: groupId },
    });
    resp.status(200).json({ expenses: Expenses });
  } catch (e) {
    console.log(e.message);
    resp.status(500);
  }
};

exports.addExpense = async (req, res) => {
  const groupId = parseInt(req.params.groupId);
  let { amount, description, category } = req.body;
  const userId = req.userId;

  try {
    const groupMember = await GroupMember.findOne({
      where: { userId, groupId },
    });
    if (!groupMember) {
      return res.status(400).json({
        success: false,
        error: "User is not part of the group",
      });
    }

    const expense = await Expense.create({
      UserId: userId,
      GroupId: groupId,
      amount,
      description,
      category,
    });

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: "No expense found..",
      });
    }

    const groupMember = await GroupMember.findOne({
      where: { userId, groupId: expense.groupId },
    });
    if (expense.userId !== userId && (!groupMember || !groupMember.isAdmin)) {
      return res.status(403).json({
        success: false,
        error: "User is not authorized to delete..",
      });
    }

    await expense.destroy();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};
