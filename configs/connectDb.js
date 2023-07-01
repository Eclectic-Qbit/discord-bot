const mongoose = require("mongoose");

async function connectDb() {
  try {
    const start = Date.now();
    await mongoose.connect(process.env.DATABASE_URI, {
      authSource: "login-bot",
    });
    console.log(`Connected to mongodb in ${Date.now() - start}ms`);
  } catch (err) {
    console.error(err);
  }
}

module.exports = connectDb;
