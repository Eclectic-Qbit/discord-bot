const axios = require("axios");
const User = require("../models/User");
const UserLog = require("../models/UserLog");
const { sign } = require("jsonwebtoken");
const { corsOptions } = require("../configs/corsOptions");

async function handleLogin(req, res) {
  const redirectURL = process.env.IS_TESTING_ENV
    ? "http://localhost:3500/login/discord/callback"
    : "http://localhost:3500/auth/callback";

  // Apply CORS to the initial response
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Perform the redirect
  res.redirect(302, redirectURL);
}
async function handleCallback(req, res) {
  const code = req.query.code;
  if (!code) {
    res.status(400).json({ message: "Code not provided!" });
    return;
  }
  const start = Date.now();
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: process.env.IS_TESTING_ENV
      ? process.env.REDIRECT_URL_TESTING
      : process.env.REDIRECT_URL_PROD,
  });
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  try {
    const response = await axios.post(
      "https://discord.com/api/oauth2/token",
      params,
      {
        headers,
      }
    );
    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
        ...headers,
      },
    });
    console.log("RESPONSE", userResponse.data);
    // update user with latest infos
    const parsedUser = {
      username: userResponse.data.username,
      globalName: userResponse.data.global_name,
      avatar: userResponse.data.avatar,
      discriminator: userResponse.data.discriminator,
      publicFlags: userResponse.data.public_flags,
      flags: userResponse.data.flags,
      banner: userResponse.data.banner,
      bannerColor: userResponse.data.banner_color,
      accentColor: userResponse.data.accent_color,
      locale: userResponse.data.locale,
      premiumType: userResponse.data.premium_type,
      avatarDecoration: userResponse.data.avatar_decoration,
      refreshToken: response.data.refresh_token,
    };
    const find = await User.findOneAndUpdate(
      { discordId: userResponse.data.id },
      parsedUser
    );
    console.log("USER", find);
    let dbId = find._id;
    let username = find.username;
    if (!find || find.length === 0) {
      const user = new User({
        discordId: userResponse.data.id,
        ...parsedUser,
        role: 0,
      });
      const saveUser = await user.save();
      dbId = saveUser._id;
      username = saveUser.username;
    }
    // save that the user logged
    const userLog = new UserLog({
      discordId: userResponse.data.id,
      date: Date.now(),
    });
    await userLog.save();
    console.log("Signing for", dbId);
    // save jwt
    const token = sign(
      { id: dbId, username: username },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    res.cookie("token", token);
    // answer
    res.redirect(process.env.CLIENT_REDIRECT_URL);
  } catch (e) {
    console.log("Error!");
    console.error(e);
    console.error(params);
    res.status(500).json({ message: "Server Error!" });
    return;
  } finally {
    console.log(`Content response in ${Date.now() - start}ms`);
  }
}

module.exports = { handleLogin, handleCallback };
