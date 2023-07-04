const { getDataFromToken } = require("../commonFunctions/commonUser");
const User = require("../models/User");

async function getUser(req, res) {
  const start = Date.now();
  const id = req.params.user;
  if (req.userInfo.id !== id) {
    res.status(403).json({ message: "You can't request other users data! :/" });
    return;
  }
  const user = await User.find({ discordId: id })
    .catch((e) => {
      console.error(e);
      res.status(500).json({ error: "Server Error! :/" });
      return;
    })
    .finally(() => {
      console.log(`Queried in ${Date.now() - start}ms`);
    });
  console.log("get user");
  res.status(200).json({ user });
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
async function updateUser(req, res) {
  const start = Date.now();
  const id = req.params.user;
  if (req.userInfo.id !== id) {
    res.status(403).json({ message: "You can't update other users data! :/" });
    return;
  }
  const body = JSON.parse(JSON.stringify(req.body));
  const parsedObj = {};
  if (body.pfp) {
    parsedObj.pfp = {
      value: null,
      date: Date.now(),
    };
    parsedObj.pfp.value = body.pfp;
  }
  if (body.customUsername) {
    parsedObj.customUsername = {
      value: null,
      date: Date.now(),
    };
    parsedObj.customUsername.value = body.customUsername;
  }
  if (body.city) {
    parsedObj.city = {
      value: null,
      date: Date.now(),
    };
    parsedObj.city.value = body.city;
  }
  const user = await User.findOneAndUpdate({ discordId: id }, parsedObj)
    .catch((e) => {
      console.error(e);
      res.status(500).json({ error: "Server Error! :/" });
      return;
    })
    .finally(() => {
      console.log(`Queried in ${Date.now() - start}ms`);
    });
  console.log("put user");
  res.status(200).json({ user });
}
module.exports = { getUser, getUsers, updateUser };
