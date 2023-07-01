const { verify } = require("jsonwebtoken");

function getDataFromToken(token) {
  return verify(token, process.env.JWT_SECRET);
}

module.exports = { getDataFromToken };
