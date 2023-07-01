const { verify } = require("jsonwebtoken");
const { getDataFromToken } = require("../commonFunctions/commonUser");

async function verifyToken(req, res, next) {
  try {
    const { id, username } = getDataFromToken(req.cookies.token);
    console.log(id, username);
  } catch (e) {
    console.error("Error checking JWT token", e);
    res.status(403).json({ message: "Unauthorized!" });
    return;
  }
  await next();
}

module.exports = { verifyToken };
