const cache = require("memory-cache");

const userCache = new cache.Cache();
const gameCache = new cache.Cache();

module.exports = { userCache, gameCache };
