const { getDataFromToken } = require("../commonFunctions/commonUser");
const User = require("../models/User");
const cache = require("memory-cache");

async function getUser(req, res) {
  const start = Date.now();
  const id = req.params.user;
  if (req.userInfo.id !== id) {
    res.status(403).json({ message: "You can't request other users data! :/" });
    return;
  }
  // Try to get the user from cache
  let user = cache.get(id);
  if (!user) {
    const fields =
      "pfp customUsername city gamePoints discordId username globalName avatar role pfp customUsername";
    const resp = await User.findOne({ discordId: id }, fields).catch((e) => {
      console.error(e);
      res.status(500).json({ error: "Server Error! :/" });
      return;
    });
    const customUsername =
      resp.customUsername && resp.customUsername.value !== "null"
        ? resp.customUsername.value
        : null;
    const pfp = resp.pfp && resp.pfp.value != -1 ? resp.pfp.value : null;
    user = {
      discordId: resp.discordId,
      username: customUsername
        ? customUsername
        : resp.globalName
        ? resp.globalName
        : resp.username,
      avatar: pfp >= 0 ? pfp : resp.avatar,
      role: resp.role,
      city: resp.city && resp.city.value ? resp.city.value : "",
      gamePoints: resp.gamePoints,
    };
    if (req.query.opt || req.query.opt === "true") {
      user.opt = {
        pfp: resp.pfp && resp.pfp.value ? resp.pfp : null,
        customUsername:
          resp.customUsername && resp.customUsername.value
            ? resp.customUsername
            : null,
        city: resp.city && resp.city.value ? resp.city : null,
      };
    }
    // Save the queried data for 1 hour, or until the user updates his data
    cache.put(id, user, 60 * 60 * 1000);
  } else {
    console.log("User was found in cache! Yey");
  }
  console.log(`Got user in  ${Date.now() - start}ms`);
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
  cache.del(id);
  res.status(200).json({ user });
}
module.exports = { getUser, getUsers, updateUser };
