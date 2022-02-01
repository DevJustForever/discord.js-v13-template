
const Discord = require("discord.js");
const cooldownedUsers = new Discord.Collection();
const { Database } = require("quickmongo");
const db = new Database(process.env.MONGODB_URL);

const config = require("../config");

module.exports = async (client, interaction) => {
 await db.connect();
    if (interaction.isCommand()) {

        const startAt = Date.now();

        if (!interaction.guildId) return;

        const cmd = client.commands.get(interaction.commandName || null);

        if (!cmd) return client.functions.log("Böyle bir komut yok", "RUN_COMMAND");
        const guild = client.guilds.cache.get(interaction.guildId);
        const member = interaction.member || await guild.members.fetch(interaction.user.id);
        if (!cmd.config.enabled) {
            return interaction.reply({ content: "Bu komut geçici olarak kullanıma kapalıdır." });
        };
       
        const userKey = `${interaction.user.id}${interaction.guild.id}`;
        const cooldownTime = cooldownedUsers.get(userKey);
        const currentDate = parseInt(Date.now() / 1000);
        if (cooldownTime) {
            const isExpired = cooldownTime <= currentDate;
            const remainingSeconds = cooldownTime - currentDate;
            if (!isExpired) {
                return interaction.reply({ content: `Bu komudu ${remainingSeconds} saniye sonra kullanabilirsin.` });
            }
        }


        try {
            cmd.execute(interaction.client, interaction, db, config);
            cooldownedUsers.set(userKey, 5 + currentDate);
        } catch {
            return client.functions.log("Komut hatası", "RUN_COMMAND");
        };
    };



};