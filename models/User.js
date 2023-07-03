const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // Discord info
  discordId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  globalName: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  discriminator: {
    type: Number,
    required: false,
  },
  publicFlags: {
    type: String,
    required: false,
  },
  flags: {
    type: String,
    required: false,
  },
  banner: {
    type: String,
    required: false,
  },
  bannerColor: {
    type: String,
    required: false,
  },
  accentColor: {
    type: String,
    required: false,
  },
  locale: {
    type: String,
    required: false,
  },
  premiumType: {
    type: Number,
    required: false,
  },
  avatarDecoration: {
    type: String,
    required: false,
  },
  role: {
    type: Number,
    default: 0,
    required: false,
  },

  // Website info
  refreshToken: {
    type: String,
    required: false,
  },
  walletAddress: {
    type: String,
    required: false,
  },
  pfp: {
    id: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    date: {
      type: Number,
      required: false,
    },
  },
  customUsername: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  // Points
  gamePoints: {
    type: Number,
    default: 0,
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
