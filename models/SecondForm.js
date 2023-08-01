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
});

module.exports = mongoose.model("SecondForm", secondFormSchema);
