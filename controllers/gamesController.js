const cache = require("memory-cache");
const { getDataFromToken } = require("../commonFunctions/commonUser");
const { getUser, updateUser, getUsers } = require("./usersController");
const { maxGamePoints, memoryGame } = require("../configs/gamesOptions");
const GameScore = require("../models/GameScore");
const { gameCache, userCache } = require("../cache/cache");
const crypto = require("crypto");

function translateId(id) {
  const users = userCache.get("users");
  for (let i = 0; i < users.length; i++) {
    if (users[i].discordId === id) {
      return users[i].username;
    }
  }
}

async function getGameToken(req, res) {
  const start = Date.now();
  const gameToken = crypto.randomUUID();
  const token = req.cookies.token;
  if (token) {
    gameCache.put(gameToken, getDataFromToken(token).id, 1000 * 60 * 60 * 24);
  }
  console.log(`Server new game token in ${Date.now() - start}ms`);
  res.status(200).json({ token: gameToken });
}
async function submitGame(req, res) {
  if (
    process.env.IS_TESTING_ENV === "true"
      ? req.headers.origin !== "http://localhost:3000"
      : req.headers.origin !== "https://www.eclecticqbit.art"
  ) {
    res.status(403).json({ message: "Unsupported origin" });
    return;
  }
  const start = Date.now();
  const token = req.cookies.token;
  const body = JSON.parse(JSON.stringify(req.body));
  const gameDuration = body.gameDuration;
  if (token) {
    const { id } = getDataFromToken(token);
    const gameToken = body.gameToken;
    const gameType = body.gameType;
    if (!body || !gameToken || !gameType || !gameDuration) {
      res
        .status(400)
        .json({ message: "Missing body, gameToken, gameType or gameDuration" });
      return;
    }
    const cachedId = gameCache.get(gameToken);
    if (cachedId !== id) {
      res
        .status(403)
        .json({ message: "Trying to access another player's game" });
      return;
    }
    cache.del(gameToken);
    // Hey there! Probably here some caching mechanisms would be super cool!
    // Since: 1) Req to db (cacheable) 2) If less than 80 update User 3) Finally update gameScores
    const user = await getUser({
      userInfo: { id: id },
      params: { user: id },
      query: { opt: true },
    });
    let fromGames = 0;
    const newArr = [];
    let currentGamePoints = 0;
    user.opt.points &&
      user.opt.points.map((el) => {
        if (el.type.toLowerCase() === "game") {
          fromGames += el.amount;
        }
        if (el.specific !== gameType) {
          newArr.push(el);
        } else {
          currentGamePoints = el.amount;
        }
      });
    console.log("USER INFO", user, currentGamePoints);
    if (maxGamePoints <= fromGames) {
      console.log("Max points");
      res.status(200).json({ message: "Game points reached" });
      return;
    }
    const pointsArr = memoryGame.points.filter(
      (el) => el.duration >= gameDuration
    );
    const points = pointsArr[0].points;
    const sum = fromGames + points;
    const totalPoints =
      sum < maxGamePoints
        ? currentGamePoints + points
        : currentGamePoints + points - (sum - maxGamePoints);
    newArr.push({
      type: "game",
      specific: gameType,
      amount: totalPoints,
    });
    console.log("NEW ARR", newArr);
    // Update in parallel
    const userProm = updateUser({
      params: {
        user: id,
      },
      userInfo: {
        id: id,
      },
      body: {
        points: newArr,
      },
    });
    const score = new GameScore({
      discordId: id,
      date: Date.now(),
      gameType: gameType,
      duration: gameDuration,
    });
    const scoreProm = score.save();
    const promises = await Promise.allSettled([userProm, scoreProm]);
    promises.map((el) => console.log(el.status, el.reason));
    res.status(200).json({
      username: user.username,
      duration: gameDuration,
      pointsGained: points,
      totalPoints: totalPoints,
    });
    return;
  }
  console.log(
    `${token ? "Inserted" : "Skipped"} new game in ${Date.now() - start}ms`
  );
  res.status(200).json({ duration: gameDuration });
  return;
}
async function getLeaderboards(req, res) {
  // Use caching both client and server side
  const start = Date.now();
  let result = gameCache.get("leaderboards")
    ? gameCache.get("leaderboards")
    : {};
  if (JSON.stringify(result) === JSON.stringify({})) {
    result.byDuration = await GameScore.aggregate([
      {
        $group: {
          _id: "$discordId",
          val: { $min: "$duration" },
        },
      },
      {
        $sort: {
          val: 1,
        },
      },
    ]);
    result.byAttempts = await GameScore.aggregate([
      {
        $group: {
          _id: "$discordId",
          val: { $sum: 1 },
        },
      },
      {
        $sort: {
          val: -1,
        },
      },
    ]);
    // This is bad! In next updates just grant the consistence of users list
    await getUsers();
    const finalLeaderboards = { byDuration: [], byAttempts: [] };
    Object.keys(result).map((type) => {
      result[type].map((el) => {
        finalLeaderboards[type].push({
          user: translateId(el._id),
          value: el.val,
        });
      });
    });
    gameCache.put("leaderboards", finalLeaderboards, 1000 * 15);
    res.status(200).json(finalLeaderboards);
    return;
  } else {
    console.log("Yeyyy, leaderboards found in cache!");
  }
  console.log(`Got leaderboards in ${Date.now() - start}ms`);
  res.status(200).json(result);
}
module.exports = { getGameToken, submitGame, getLeaderboards };
