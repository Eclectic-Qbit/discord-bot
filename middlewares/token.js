const { getDataFromToken } = require("../commonFunctions/commonUser");
const { signToken } = require("../commonFunctions/commonToken");

async function verifyToken(req, res, next) {
  try {
    const { id, username, avatar, exp } = getDataFromToken(req.cookies.token);
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
      res.cookie("token", newToken);
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
