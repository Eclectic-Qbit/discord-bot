const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const firstFormSchema = new Schema({
  createdAt: {
    type: Number,
  },
  userId: {
    type: String,
  },
  discordHandle: {
    type: String,
  },
  telegramHandle: {
    type: String,
  },
  socialmedia: {
    type: String,
  },
  country: {
    type: String,
  },
  reasons: {
    type: String,
  },
});

module.exports = mongoose.model("FirstForm", firstFormSchema);
