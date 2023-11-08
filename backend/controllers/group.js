const Group = require("../models/group");
const Expense = require("../models/expense");
const GroupMember = require("../models/groupmember");
const sequelize = require("../util/database");
const User = require("../models/user");
const { Op } = require("sequelize");

exports.addMembersToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { usernames } = req.body;

  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isAdmin = await GroupMember.findOne({
      where: { GroupId: groupId, UserId: req.userId, isAdmin: true },
    });
    if (!isAdmin) {
      return res.status(403).json({ message: "permission denied" });
    }
    console.log(usernames);
    const users = await User.findAll({
      where: { username: { [Op.in]: usernames } },
    });
    if (!users.length) {
      return res.status(404).json({ message: "no users found.." });
    }

    const groupMembers = users.map((user) => ({
      GroupId: groupId,
      UserId: user.id,
    }));
    await GroupMember.bulkCreate(groupMembers);
    res.status(201).json({ message: "Users added to the group" });
  } catch (error) {
    console.error("Error adding members to group:", error);
    res.status(500).json({ message: "Error adding members" });
  }
};

exports.createGroup = async (req, res) => {
  const { name } = req.body;
  const t = await sequelize.transaction();
  try {
    const group = await Group.create({ name }, { transaction: t });

    await GroupMember.create(
      {
        GroupId: group.id,
        UserId: req.userId,
        isAdmin: true,
      },
      { transaction: t }
    );
    await t.commit();

    return res
      .status(201)
      .json({ message: "Group created successfully", id: group.id });
  } catch (error) {
    await t.rollback();
    console.error("Error creating group:", error);
    return res.status(500).json({ message: "Error creating group" });
  }
};

exports.getUserGroups = async (req, res) => {
  const userId = req.userId;

  try {
    const userGroups = await GroupMember.findAll({
      where: { UserId: userId },
      include: [{ model: Group }],
    });

    const formattedGroups = userGroups.map((userGroup) => ({
      groupName: userGroup.Group.name,
      isAdmin: userGroup.isAdmin,
      groupId: userGroup.Group.id,
    }));

    return res.status(200).json(formattedGroups);
  } catch (error) {
    console.error("Error getting user groups:", error);
    return res.status(500).json({ message: "Error getting user groups" });
  }
};

exports.deleteGroup = async (req, res) => {
  const { groupId } = req.params;
  const userId = req.userId;
  const transaction = await sequelize.transaction();
  try {
    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Invalid group Id" });
    }

    const groupAdmin = await GroupMember.findOne({
      where: { GroupId: groupId, UserId: userId, isAdmin: true },
      transaction,
    });

    if (!groupAdmin) {
      return res
        .status(403)
        .json({ message: "only group admin can delete group" });
    }

    await Promise.all([
      Expense.destroy({ where: { GroupId: groupId }, transaction }),

      GroupMember.destroy({ where: { GroupId: groupId }, transaction }),

      Group.destroy({ where: { id: groupId }, transaction }),
    ]);

    transaction.commit();

    return res.status(200).json({ message: "group deleted successfully" });
  } catch (error) {
    console.error("error deleting group:", error);
    await transaction.rollback();
    return res.status(500).json({ message: "error deleting group" });
  }
};
