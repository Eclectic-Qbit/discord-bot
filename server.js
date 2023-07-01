// imports
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./configs/connectDb");
const cookieParser = require("cookie-parser");
const { verifyToken } = require("./middlewares/token");
// middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));
app.use(verifyToken);
// db connection
connectDb();
// routes
app.use("/ping", (req, res) => {
  console.log("Some1 pinged!");
  res.status(200).json({ message: "Pong!" });
});
// app.use("/users", require("./routes/api/users"));
app.use("/login", require("./routes/login"));
// start express
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server started & listening on port ", PORT);
});
