const express = require("express");
const router = express.Router();
const groupControllers = require("../controllers/group");
const verify = require("../middlewares/verify");

router.post("/create", verify.verifyToken, groupControllers.createGroup);

// router.delete("/:groupId", verify.verifyToken, groupControllers.deleteGroup);

router.get(
  "/getUserGroups",
  verify.verifyToken,
  groupControllers.getUserGroups
);
router.post(
  "/:groupId/addMembers",
  verify.verifyToken,
  groupControllers.addMembersToGroup
);

module.exports = router;
