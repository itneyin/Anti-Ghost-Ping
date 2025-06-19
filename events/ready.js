const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

module.exports = {
    name: 'ready',
    once: true,
    execute(client, commands) {
        console.debug('ready!');

        // Set bot status
        const status = "/activate";
        client.user.setStatus("online");
        client.user.setActivity(status, {
            type: "STREAMING",
            url: "https://www.youtube.com/watch?v=VDjapkV9XGM&feature=youtu.be",
        });

        // Check that TOKEN environment variable is set
if (!process.env.TOKEN) {
    console.error("❌ TOKEN environment variable is not defined.");
    console.error("Current environment variables:", process.env);
    // Comment out process.exit to debug:
    // process.exit(1);
}


        const CLIENT_ID = client.user.id;
        const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

        (async () => {
            try {
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                });
                console.info(`Successfully registered commands globally! Serving ${client.guilds.cache.map(guild => guild.memberCount).reduce((s, v) => s + (v || 0), 0)} users across ${client.guilds.cache.size} servers.`);
            } catch (err) {
                console.error(err);
            }
        })();
    }
};
