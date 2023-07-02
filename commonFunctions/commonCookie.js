function setDefaultCookie(res, name, val) {
  const sameSite = process.env.IS_TESTING_ENV === "true" ? "strict" : "strict";
  const domain =
    process.env.IS_TESTING_ENV === "true" ? ".localhost" : ".eclecticqbit.art";
  const maxAge = 2 * 1000 * 60 * 60;
  const httpOnly = false;
  const secure = process.env.IS_TESTING_ENV === "true" ? false : true;
  res.cookie(name, val, {
    maxAge: maxAge,
    httpOnly: httpOnly,
    secure: secure,
    domain: domain,
    sameSite: sameSite,
  });
  console.log("Setted cookie", res.getHeaders());
}
module.exports = { setDefaultCookie };
