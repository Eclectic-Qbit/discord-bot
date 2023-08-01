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
  approved: {
    type: Boolean,
    default: false,
  },
  rejected: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("FirstForm", firstFormSchema);
