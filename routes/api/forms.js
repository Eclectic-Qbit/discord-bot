const express = require("express");
const {
  insertFirstForm,
  getUserFirstForms,
  getUserSecondForms,
  insertSecondForm,
} = require("../../controllers/formsController");
const { verifyToken } = require("../../middlewares/token");

const router = express.Router();

router.route("/firstForms/:userId").get(verifyToken, getUserFirstForms);
router.route("/firstForms").post(insertFirstForm);
router.route("/secondForms/:userId").get(verifyToken, getUserSecondForms);
router.route("/secondForms").post(insertSecondForm);

module.exports = router;
