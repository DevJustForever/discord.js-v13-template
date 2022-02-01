require("dotenv").config();
const fs = require("fs");
const Path = require("path");
const Discord = require("discord.js");
const { Intents } = require("discord.js");
const INTENS = Object.values(Intents.FLAGS);

const client = global.client = new Discord.Client({
intents: INTENS, /*[
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_SCHEDULED_EVENTS
    ],*/
    allowedMentions: {
        parse: ["users"]
    },
    partials: ["GUILD_MEMBER", "CHANNEL", "MESSAGE", "REACTION", "USER"],
    retryLimit: 3
});
const { Database } = require("quickmongo");
const db = client.db = global.db = new Database(process.env.MONGODB_URL);
client.commands = global.commands = new Discord.Collection();
client.functions = global.functions = require("./helpers/functions");
const synchronizeSlashCommands = require('discord-sync-commands');
db.connect();

const eventsRegister = () => {
    let eventsDir = Path.resolve(__dirname, './events');
    if (!fs.existsSync(eventsDir)) return client.functions.log("Events klasörü yok.", "EVENTS_REGISTER");
    fs.readdirSync(eventsDir, { encoding: "utf-8" }).filter((cmd) => cmd.split(".").pop() === "js").forEach((event) => {
        let prop = require(`./events/${event}`);
        if (!prop) return client.functions.log("Props(lar) yok.", "EVENTS_REGISTER");
        client.functions.log(`${event} etkinliği uygulandı.`, "EVENTS_REGISTER");
        client.on(event.split('.')[0], prop.bind(null, client));
        delete require.cache[require.resolve(`./events/${event}`)];
    });
};

const commandsRegister = () => {
    let commandsDir = Path.resolve(__dirname, './commands');
    if (!fs.existsSync(commandsDir)) return client.functions.log("Events klasörü yok.", "COMMANDS_REGISTER");
    fs.readdirSync(commandsDir, { encoding: "utf-8" }).filter((cmd) => cmd.split(".").pop() === "js").forEach((command) => {
        let prop = require(`./commands/${command}`);
        if (!prop) return client.functions.log("Props(lar) yok.", "COMMANDS_REGISTER");
        client.functions.log(`${command} komutu kaydedildi.`, "COMMANDS_REGISTER");
        client.commands.set(prop.options.name, prop);
        delete require.cache[require.resolve(`./commands/${command}`)];
    });
};



const slashCommandsRegister = () => {
    const commands = client.commands.filter((c) => c.options);
    const fetchOptions = { debug: true };
    synchronizeSlashCommands(client, commands.map((c) => c.options), fetchOptions);
};

const portRegister = () => {
    const app = require("express")();
    app.use("*", async (req, res, next) => {
        res.json({ message: "Api!" });
        next();
    });
    app.listen(process.env.PORT || 80);
};

eventsRegister();
commandsRegister();
slashCommandsRegister();
portRegister();

db.on("ready", async () => {
    client.functions.log(`Database Bağlandım.`, "DB_CONNECTION");
});


client.login(process.env.TOKEN || null).then((_) => {
    return client.functions.log("Token girişi başarılı.", "TOKEN_LOGIN");
}).catch((e) => {
return client.functions.log("Token girişi başarısız.", "TOKEN_LOGIN");
});


process.on('unhandledRejection', error => {
    console.log(error);
});
