function setDefaultCookie(res, name, val) {
  const domain =
    process.env.IS_TESTING_ENV === "true" ? ".localhost" : ".eclecticqbit.art";
  const maxAge = 1 * 1000 * 60 * 60;
  const secure = process.env.IS_TESTING_ENV === "true" ? false : true;
  res.cookie(name, val, {
    maxAge: maxAge,
    secure: secure,
    domain: domain,
    sameSite: "strict",
  });
  console.log("Setted cookie");
}
module.exports = { setDefaultCookie };
