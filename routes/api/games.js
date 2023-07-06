const express = require("express");
const {
  getGameToken,
  submitGame,
  getLeaderboards,
} = require("../../controllers/gamesController");
const router = express.Router();

router.route("/").get(getGameToken);
router.route("/").post(submitGame);
router.route("/:game/leaderboards/").get(getLeaderboards);

module.exports = router;
