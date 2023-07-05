// imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./configs/connectDb");
const cookieParser = require("cookie-parser");
const { verifyToken } = require("./middlewares/token");
const { corsOptions } = require("./configs/corsOptions");
const discordBot = require("./discord/discord");
const { connectDiscord } = require("./configs/connectDiscord");

// middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// db connection
connectDb();
// login with discord
connectDiscord(discordBot);

// routes
const pre = process.env.IS_TESTING_ENV === "true" ? "" : "/api";
// => unprotected
app.use(`${pre}/ping`, (req, res) => {
  console.log("Some1 pinged!");
  res.status(200).json({ message: "Pong!" });
});
app.use(`${pre}/login`, require("./routes/login"));
app.use(verifyToken);
app.use(`${pre}/users`, require("./routes/api/users"));
// => protected
// ...
// start express
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server started & listening on port ", PORT);
});
