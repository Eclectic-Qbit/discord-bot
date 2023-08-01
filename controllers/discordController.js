const { discordCache } = require("../cache/cache");
const { allowedRoles } = require("../configs/allowedRoles");
const { updateUser } = require("./usersController");

async function syncUser(member) {
  const roles = member.roles.cache;
  const parsedUser = {
    discordId: member.user.id,
    username: member.user.username,
    discriminator: member.user.discriminator,
    avatar: member.user.avatar,
    banner: member.user.banner,
    accentColor: member.user.accentColor,
    discordRoles: [],
  };
  roles.map((role) => {
    const name = role.name;
    if (allowedRoles.includes(name)) {
      parsedUser.discordRoles.push(name);
    }
  });
  const req = {
    params: {
      user: parsedUser.discordId,
    },
    userInfo: {
      id: parsedUser.discordId,
    },
    body: parsedUser,
  };
  await updateUser(req, null);
}
async function syncUsers(client) {
  try {
    console.log("- - - - -");
    console.log("Syncing Users:");
    console.log("");
    const start = Date.now();
    const guild = client.guilds.cache.get(process.env.DISCORD_SERVER_ID);
    const members = await guild.members.fetch();
    const deltaMembers = Date.now() - start;
    console.log(`Got member list in ${deltaMembers}ms`);
    console.log("");
    let total = 0;
    const cachedMembers = [];
    await members.reduce(async (prev, el) => {
      await prev;
      if (!el.user.bot) {
        total++;
        await syncUser(el);
        cachedMembers.push(el.user.username);
      }
    }, Promise.resolve());
    discordCache.put("members", cachedMembers);
    const delta = Date.now() - start - deltaMembers;
    console.log("");
    console.log(
      `Retrieved discord members (${total}) in ${delta}ms. Avg: ${Math.round(
        delta / total
      )}ms/user`
    );
    console.log("- - - - -");
  } catch (e) {
    console.error("Could not sync ALL users", e);
  }
}

module.exports = { syncUser, syncUsers };
