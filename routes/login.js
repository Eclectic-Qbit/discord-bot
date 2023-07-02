const express = require("express");
const { handleCallback } = require("../controllers/loginController");
const router = express.Router();

router.route("/discord/callback").get(handleCallback);
module.exports = router;
