const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameScoreSchema = new Schema({
  discordId: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  gameType: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("GameScore", gameScoreSchema);
