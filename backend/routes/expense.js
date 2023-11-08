const express = require("express");
const router = express.Router();
const expenseControllers = require("../controllers/expense");
const { verifyToken } = require("../middlewares/verify");

router.post("/:groupId/addExpense", verifyToken, expenseControllers.addExpense);

// router.delete(
//   "/:groupId/deleteExpense",
//   verifyToken,
//   expenseControllers.deleteExpense
// );
router.get(
  "/:groupId/getExpenses",
  verifyToken,
  expenseControllers.getExpenses
);
router.get(
  "/:groupId/getAnalysis",
  verifyToken,
  expenseControllers.getAnalysis
);

module.exports = router;
