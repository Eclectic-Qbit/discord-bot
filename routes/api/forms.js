const express = require("express");
const { insertFirstForm } = require("../../controllers/formsController");

const router = express.Router();

router.route("/firstForm").post(insertFirstForm);
module.exports = router;
