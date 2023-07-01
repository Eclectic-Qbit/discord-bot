const express = require("express");
const { getUsers, getUser } = require("../../controllers/usersController");
const router = express.Router();

router.route("/").get(getUsers);
router.route("/:user").get(getUser);

module.exports = router;
