const FirstForm = require("../models/FirstForm");
const SecondForm = require("../models/SecondForm");
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
        { customUsername: { value: username } },
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

async function insertSecondForm(req, res) {
  const body = req.body;
  console.log(body);
  if (!body || !body.formId) {
    console.log(400);
    return res.sendStatus(400);
  }
  console.log(body.formId);
  if (body.formId !== "1oxgVQ-5e43RR9-454C5Imj0Fui5wfUn0FmRoeOqFR_o") {
    console.log(403);
    return res.sendStatus(403);
  }
  const {
    created_at,
    username,
    preferredLang,
    wallSize,
    colors,
    shipmentAddress,
    live,
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
  const newForm = new SecondForm({
    createdAt: created_at,
    userId: result.discordId,
    preferredLang: preferredLang,
    wallSize: wallSize,
    colors: colors,
    shipmentAddress: shipmentAddress,
    live: live,
  });
  const save = await newForm.save();
  console.log("FOR", save);
  return res.sendStatus(200);
}

async function getUserFirstForms(req, res) {
  const userId = req.params.userId;
  const result = await FirstForm.find({ userId: userId });
  if (result && result.length > 0) {
    res && res.status(200).json(result);
    return result;
  }
  res && res.sendStatus(404);
  return null;
}

async function getUserSecondForms(req, res) {
  const userId = req.params.userId;
  const result = await SecondForm.find({ userId: userId });
  if (result && result.length > 0) {
    res && res.status(200).json(result);
    return result;
  }
  res && res.sendStatus(404);
  return null;
}

module.exports = {
  insertFirstForm,
  insertSecondForm,
  getUserFirstForms,
  getUserSecondForms,
};
