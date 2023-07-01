const express = require("express");
const {
  handleLogin,
  handleCallback,
} = require("../controllers/loginController");
const router = express.Router();

router.route("/discord").get(handleLogin);
router.route("/discord/callback").get(handleCallback);
module.exports = router;
