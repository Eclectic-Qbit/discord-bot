const User = require("../models/User");

async function getUser(req, res) {
  console.log("get user!");
  res.status(200).json({});
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
