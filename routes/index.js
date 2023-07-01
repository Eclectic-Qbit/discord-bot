const express = require("express");
const { handleIndex } = require("../controllers/indexController");
const router = express.Router();

router.route("/").get(handleIndex);

module.exports = router;
