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
    await members.reduce(async (prev, el) => {
      await prev;
      if (!el.user.bot) {
        await syncUser(el);
      }
    }, Promise.resolve());
    console.log(`Retrieved discord members in ${Date.now() - start}ms`);
    console.log("- - - - -");
  } catch (e) {
    console.error("Could not sync ALL users", e);
  }
}

module.exports = { syncUser, syncUsers };
