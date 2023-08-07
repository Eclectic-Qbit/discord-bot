const User = require("../models/User");
const UserLog = require("../models/UserLog");
const { getDiscordData } = require("../commonFunctions/commonDiscord");
const { signToken } = require("../commonFunctions/commonToken");
const { setDefaultCookie } = require("../commonFunctions/commonCookie");

async function handleCallback(req, res) {
  const code = req.query.code;
  if (!code) {
    res.status(400).json({ message: "Code not provided!" });
    return;
  }
  const start = Date.now();
  const userResponse = await getDiscordData(code);
  if (!userResponse) {
    res.status(500).json({ message: "Server Error!" });
    return;
  }
  // update user with latest infos
  const parsedUser = {
    discordId: userResponse.id,
    username: userResponse.username,
    globalName: userResponse.global_name,
    avatar: userResponse.avatar,
    discriminator: userResponse.discriminator,
    publicFlags: userResponse.public_flags,
    flags: userResponse.flags,
    banner: userResponse.banner,
    bannerColor: userResponse.banner_color,
    accentColor: userResponse.accent_color,
    locale: userResponse.locale,
    premiumType: userResponse.premium_type,
    avatarDecoration: userResponse.avatar_decoration,
    refreshToken: userResponse.refreshToken,
  };
  const find = await User.findOneAndUpdate(
    { discordId: userResponse.id },
    parsedUser
  );
  if (!find || find.length === 0) {
    const user = new User({
      ...parsedUser,
      role: 0,
    });
    await user.save();
  }
  // save that the user logged, if it's not testing env
  if (process.env.IS_TESTING_ENV !== "true") {
    const userLog = new UserLog({
      discordId: userResponse.id,
      date: Date.now(),
    });
    await userLog.save();
  }
  console.log(userResponse, find);
  // save jwt
  const tokenObj = {
    id: userResponse.id,
    username: userResponse.username,
    avatar: {
      type: find.pfp && find.pfp.value > -2 ? "native" : "discord",
      value:
        find.pfp && find.pfp.value > -2 ? find.pfp.value : userResponse.avatar,
    },
  };
  const token = signToken(tokenObj);
  setDefaultCookie(res, "token", token);
  console.log(`User updated&logged in ${Date.now() - start}ms`);
  // answer
  res.redirect(
    process.env.IS_TESTING_ENV === "true"
      ? process.env.CLIENT_REDIRECT_TESTING_URL
      : process.env.CLIENT_REDIRECT_PROD_URL
  );
}

module.exports = { handleCallback };
