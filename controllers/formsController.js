const FirstForm = require("../models/FirstForm");
const User = require("../models/User");

async function insertFirstForm(req, res) {
  const body = req.body;
  console.log(body);
  if (!body || !body.formId) {
    console.log(400);
    return res.sendStatus(400);
  }
  console.log(body.formId);
  if (body.formId !== "1uAKl_MpdF0imY6UEbq-CgwcAocoLC8pX0Q2d4QgOiYc") {
    console.log(403);
    return res.sendStatus(403);
  }
  const {
    created_at,
    username,
    discordHandle,
    telegramHandle,
    socialmedia,
    country,
    reasons,
  } = body;
  // Get user id
  const result = await User.findOne(
    {
      $or: [
        { customUsername: username },
        { globalName: username },
        { username: username },
      ],
    },
    "discordId"
  );
  console.log("RESULT 1", result);
  if (!result) {
    return res.sendStatus(404);
  }
  const newForm = new FirstForm({
    createdAt: created_at,
    userId: result.discordId,
    discordHandle: discordHandle,
    telegramHandle: telegramHandle,
    socialmedia: socialmedia,
    country: country,
    reasons: reasons,
  });
  const save = await newForm.save();
  console.log("FOR", save);
  return res.sendStatus(200);
}
module.exports = { insertFirstForm };
