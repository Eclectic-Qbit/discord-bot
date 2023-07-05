const { verify } = require("jsonwebtoken");

function getDataFromToken(token) {
  try {
    return verify(token, process.env.JWT_SECRET);
  } catch (e) {
    console.error("Exception verifying token - commonUser", e);
    return null;
  }
}

module.exports = { getDataFromToken };
