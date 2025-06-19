require('dotenv').config();
const fs = require('fs');
const express = require('express');
const { Client, Collection, MessageEmbed } = require('discord.js');
const Database = require('./config/Database');

if (!process.env.MONGO_URI) {
  console.error('❌ MongoDB URI missing! Please set MONGO_URI in your environment variables.');
  process.exit(1);
}

if (!process.env.TOKEN) {
  console.error('❌ Discord bot TOKEN is missing in environment variables!');
  process.exit(1);
}

const db = new Database();
const client = new Client({ 
  intents: [
    'GUILDS',
    'GUILD_MEMBERS',
    'GUILD_MESSAGES',
    'GUILD_MESSAGE_REACTIONS',
    'GUILD_MESSAGE_TYPING',
    'GUILD_BANS',
    'GUILD_EMOJIS_AND_STICKERS',
    'GUILD_INTEGRATIONS',
    'GUILD_INVITES',
    'GUILD_VOICE_STATES',
  ] 
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = [];
client.commands = new Collection();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, commands));
  } else {
    client.on(event.name, (...args) => event.execute(...args, commands));
  }
}

client.on('guildCreate', guild => {   
  const guild_embed = new MessageEmbed()
    .setColor('FFFF00')
    .setTitle('New Guild!')
    .setDescription(`I have joined the server ${guild.name}`)
    .addFields(
      { name: 'Members:', value: `${guild.memberCount}` },
      { name: 'Guild ID:', value: `${guild.id}` },
      { name: 'Guild owner:', value: `> <@${guild.ownerId}> \`[${guild.ownerId}]\`` },
      { name: 'Total servers:', value: `${client.guilds.cache.size}` },
    )
    .setThumbnail(guild.iconURL())
    .setTimestamp();
  client.channels.cache.get('1079988516542496808')?.send({ embeds: [guild_embed] });
});

client.on('guildDelete', guild => {
  if (guild.available) {
    const embed = new MessageEmbed()
      .setColor('FFFF00')
      .setTitle('Guild Left')
      .setDescription(`I left the server ${guild.name}`)
      .addFields(
        { name: 'Members:', value: `${guild.memberCount}` },
        { name: 'Guild ID:', value: `${guild.id}` },
        { name: 'Guild owner:', value: `> <@${guild.ownerId}> \`[${guild.ownerId}]\`` },
        { name: 'Total servers:', value: `${client.guilds.cache.size}` },
      )
      .setThumbnail(guild.iconURL())
      .setTimestamp();
    client.channels.cache.get('1079988516542496808')?.send({ embeds: [embed] });
  }
});

db.connect().then(() => {
  console.log('✅ Connected to MongoDB');
  client.login(process.env.TOKEN);
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// ----------------------------------------
// Dummy Express server for Render.com
// ----------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is alive!'));

app.listen(PORT, () => {
  console.log(`Dummy server listening on port ${PORT}`);
});
