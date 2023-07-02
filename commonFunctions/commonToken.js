const { sign } = require("jsonwebtoken");

function signToken(obj) {
  return sign(obj, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
}

module.exports = { signToken };
