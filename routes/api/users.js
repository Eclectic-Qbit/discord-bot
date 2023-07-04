const express = require("express");
const { getUser, updateUser } = require("../../controllers/usersController");
const router = express.Router();

router.route("/:user").get(getUser);
router.route("/:user").put(updateUser);

module.exports = router;
