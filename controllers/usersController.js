const { userCache, discordCache } = require("../cache/cache");
const User = require("../models/User");
const { getUserFirstForms, getUserSecondForms } = require("./formsController");

async function getRules(resp) {
  const user = resp.globalName ? resp.globalName : resp.username;
  const members = discordCache.get("members");
  const first = members && members.includes(user);
  const second = await getUserFirstForms({
    params: { userId: resp.discordId },
  });
  const third = second && resp.walletAddress;
  const forth =
    second &&
    third &&
    (await getUserSecondForms({
      params: { userId: resp.discordId },
    }));
  const fifth = false; // Still to think
  const sixth = false; // Still to think
  const tasks = [
    {
      state: first ? "done" : "",
      data: null,
    },
    {
      state: !second
        ? null
        : second[0].approved
        ? "done"
        : second[0].rejected
        ? "rejected"
        : "waiting",
      data: null,
    },
    {
      state: third ? "done" : "",
      data: null,
    },
    {
      state: forth ? "done" : "",
      data: null,
    },
    {
      state: fifth ? "done" : "",
      data: null,
    },
    {
      state: sixth ? "done" : "",
      data: null,
    },
  ];
  return tasks;
}

async function getFinalData(resp) {
  const customUsername =
    resp.customUsername && resp.customUsername.value !== "null"
      ? resp.customUsername.value
      : null;
  const pfp = resp.pfp && resp.pfp.value != -1 ? resp.pfp.value : null;
  let points = 0;
  resp.points &&
    resp.points.map((el) => {
      points += el.amount;
    });
  return {
    discordId: resp.discordId,
    username: customUsername
      ? customUsername
      : resp.globalName
      ? resp.globalName
      : resp.username,
    avatar: pfp >= 0 ? pfp : resp.avatar,
    role: resp.role,
    city: resp.city && resp.city.value ? resp.city.value : "",
    discordRoles: resp.discordRoles,
    points: points,
    paintEarnRules: await getRules(resp),
  };
}
async function getUser(req, res) {
  const start = Date.now();
  const id = req.params.user;
  if (req.userInfo.id !== id) {
    res &&
      res
        .status(403)
        .json({ message: "You can't request other users data! :/" });
    return null;
  }
  // Try to get the user from cache
  let user = userCache.get(id);
  if (!user) {
    let fields =
      "city points exp discordRoles discordId username globalName avatar role pfp customUsername";
    if (req.query.opt || req.query.opt === "true") {
      fields += "pfp customUsername";
    }
    const resp = await User.findOne({ discordId: id }, fields).catch((e) => {
      console.error(e);
      res.status(500).json({ error: "Server Error! :/" });
      return null;
    });
    if (!resp) {
      res && res.status(404).json({ message: "User not found" });
      return null;
    }
    user = await getFinalData(resp);

    user.opt = {
      pfp: resp.pfp && resp.pfp.value ? resp.pfp : null,
      customUsername:
        resp.customUsername && resp.customUsername.value
          ? resp.customUsername
          : null,
      city: resp.city && resp.city.value ? resp.city : null,
      points: resp.points,
    };
    // Save the queried data for 1 hour, or until the user updates his data
    userCache.put(id, user, 60 * 60 * 1000);
  } else {
    console.log("User was found in cache! Yey");
  }
  console.log(`Got user in  ${Date.now() - start}ms`);
  res && res.status(200).json({ user });
  return user;
}
async function getUsers(req, res) {
  const start = Date.now();
  const users = await User.find({}).catch((e) => {
    console.error(e);
    res && res.status(500).json({ error: "Server Error! :/" });
    return null;
  });
  if (!users) {
    res && res.status(404).json({ message: "User not found" });
    return null;
  }
  const finalUsers = [];
  users.map((el) => {
    finalUsers.push(getFinalData(el));
  });
  // Save the queried data for 1 hour, or until the user updates his data
  userCache.put("users", finalUsers);
  console.log(`Got all users in  ${Date.now() - start}ms`);
  res && res.status(200).json({ finalUsers });
  return finalUsers;
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
  if (body.username) {
    parsedObj.username = body.username;
  }
  if (body.discriminator) {
    parsedObj.discriminator = body.discriminator;
  }
  if (body.avatar) {
    parsedObj.avatar = body.avatar;
  }
  if (body.points) {
    parsedObj.points = body.points;
  }
  if (body.discordRoles && body.discordRoles.length > 0) {
    parsedObj.discordRoles = body.discordRoles;
  }
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
  const user = await User.findOneAndUpdate({ discordId: id }, parsedObj).catch(
    (e) => {
      console.error(e);
      res && res.status(500).json({ error: "Server Error! :/" });
      return null;
    }
  );
  userCache.del(id);
  console.log(`Updated user in ${Date.now() - start}ms`);
  res && res.status(200).json({ user });
  return user;
}
module.exports = { getUser, getUsers, updateUser };
