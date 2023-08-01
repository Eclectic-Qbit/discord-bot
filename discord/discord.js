const { Client, GatewayIntentBits } = require("discord.js");
const { syncUser, syncUsers } = require("../controllers/discordController");
const { getUsers } = require("../controllers/usersController");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Required for guild-related events
    GatewayIntentBits.GuildMembers, // Required for member-related events
  ],
});

// This code will only provide sync for user - roles at the time I'm writing
client.on("ready", () => {
  syncUsers(client).then(() => {
    getUsers(); // Once discord cache is up-to-date, cache the users
  });
});
client.on("guildMemberUpdate", (oldM, newM) => {
  const oldRoles = oldM.roles.cache.map((el) => el.name);
  const newRoles = newM.roles.cache.map((el) => el.name);
  if (oldRoles !== newRoles) {
    console.log(`Updating ${newM.user.username}'s roles to [${newRoles}]`);
    syncUser(newM);
  }
});

module.exports = client;
