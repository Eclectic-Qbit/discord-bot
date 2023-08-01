const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const secondFormSchema = new Schema({
  createdAt: {
    type: Number,
  },
  userId: {
    type: String,
  },
  preferredLang: {
    type: String,
  },
  wallSize: {
    type: String,
  },
  colors: {
    type: String,
  },
  shipmentAddress: {
    type: String,
  },
  live: {
    type: Boolean,
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

module.exports = mongoose.model("SecondForm", secondFormSchema);
