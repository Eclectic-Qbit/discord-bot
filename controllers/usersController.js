const { getDataFromToken } = require("../commonFunctions/commonUser");
const User = require("../models/User");

async function getUser(req, res) {
  const start = Date.now();
  const id = req.params.user;
  if (req.userInfo.id !== id) {
    res.status(403).json({ message: "You can't request other users data! :/" });
    return;
  }
  const users = await User.find({ discordId: id })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ error: "Server Error! :/" });
      return;
    })
    .finally(() => {
      console.log(`Queried in ${Date.now() - start}ms`);
    });
  console.log("get user");
  res.status(200).json({ users });
}
async function getUsers(req, res) {
  const start = Date.now();
  const users = await User.find({})
    .catch((e) => {
      console.error(e);
      res.status(500).json({ error: "Server Error! :/" });
      return;
    })
    .finally(() => {
      console.log(`Queried in ${Date.now() - start}ms`);
    });
  console.log("get users");
  res.status(200).json({ users });
}

module.exports = { getUser, getUsers };
