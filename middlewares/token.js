const { getDataFromToken } = require("../commonFunctions/commonUser");
const { signToken } = require("../commonFunctions/commonToken");
const { setDefaultCookie } = require("../commonFunctions/commonCookie");

async function verifyToken(req, res, next) {
  try {
    console.log(req.cookies);
    const cookie =
      req.cookies.token ||
      req.headers.Authorization ||
      req.headers.authorization;
    if (!cookie) {
      res.status(403).json({ message: "Unauthorized!" });
      console.log("Request filtered, no cookie was found");
      return;
    }
    const { id, username, avatar, exp } = getDataFromToken(cookie);
    req.userInfo = { id, username, avatar, exp };
    if (Date.now() >= exp * 1000) {
      res.clearCookie("token");
      res.status(403).json({ message: "Unauthorized!" });
      console.log("Deleted Token For", username);
      return;
    } else {
      const newToken = signToken({
        id: id,
        username: username,
        avatar: avatar,
      });
      setDefaultCookie(res, "token", newToken);
      console.log("Refreshed Token For", username);
    }
  } catch (e) {
    console.error("Error checking JWT token", e);
    res.status(403).json({ message: "Unauthorized!" });
    return;
  }
  await next();
}

module.exports = { verifyToken };
