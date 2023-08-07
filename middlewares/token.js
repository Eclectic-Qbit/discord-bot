const { getDataFromToken } = require("../commonFunctions/commonUser");
const { signToken } = require("../commonFunctions/commonToken");
const { setDefaultCookie } = require("../commonFunctions/commonCookie");

async function verifyToken(req, res, next) {
  const cookie =
    req.cookies.token || req.headers.Authorization || req.headers.authorization;
  if (!cookie) {
    res.status(403).json({ message: "Unauthorized!" });
    console.log("Request filtered, no cookie was found");
    return;
  }
  // In case of token expiration, the decoding throws an error
  const vals = getDataFromToken(cookie);
  if (!vals) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
  const { id, username, avatar, exp } = vals;
  req.userInfo = { id, username, avatar, exp };

  const newToken = signToken({
    id: id,
    username: username,
    avatar: avatar,
  });
  setDefaultCookie(res, "token", newToken);
  console.log("Refreshed Token For", username);

  await next();
}

module.exports = { verifyToken };
