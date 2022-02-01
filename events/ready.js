module.exports = async (client) => {
    await client.user.setPresence({ activities: [{ name: client.user.username + ' sizlerle!', url: "https://www.twitch.tv/mertcelik2196", type: "COMPETING" }], status: 'dnd', afk: false });
    client.functions.log("Bot giriş yaptı.", "READY");
    let usersCount = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    let users2Count = client.users.cache.size;
    let guild = client.guilds.cache.size;
    let channel = client.channels.cache.size;
    let emojis = client.emojis.cache.size;
    client.functions.log(`Kullanıcı: [${usersCount}]`, "READY");
    client.functions.log(`Kullanıcı: [${users2Count}]`, "READY");
    client.functions.log(`Sunucu: [${guild}]`, "READY");
    client.functions.log(`Kanal: [${channel}]`, "READY");
    client.functions.log(`Emoji: [${emojis}]`, "READY");
    client.functions.log(`https://github.com/DevJustForever`, "READY");
};
