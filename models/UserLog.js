const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userLogSchema = new Schema({
  discordId: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("UserLog", userLogSchema);
