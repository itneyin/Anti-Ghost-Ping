const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const Discord = require('discord.js');
const Activate = require('../models/Activates');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deactivate')
    .setDescription('Deactivate the ghost ping feature of the bot'),

  async execute(interaction) {
    const unauthorized = new Discord.MessageEmbed()
      .setColor('FF0000')
      .setTitle(`**:x: Unauthorized!**`)
      .setDescription(`You are not authorized to use this command.`);

    const deactivated_embed = new Discord.MessageEmbed()
      .setColor('FF0000')
      .setTitle(`**Ghost Ping detection deactivated successfully!**`)
      .setDescription(`Now the bot will not detect any ghost pings in this server!`)
      .setTimestamp()
      .setThumbnail(interaction.client.user.displayAvatarURL());

    const db_fail = new Discord.MessageEmbed()
      .setColor('FF0000')
      .setTitle(`**:x: Database Error!**`)
      .setDescription(`An error occurred in the database!`)
      .setImage('https://media.discordapp.net/attachments/1079259438566883349/1080014089163649094/image.png');

    // ✅ Restrict to specific user
    if (interaction.user.id !== '901746391494316071') {
      return interaction.reply({ embeds: [unauthorized], ephemeral: true });
    }

    const activated = await Activate.findOne({ guild_id: interaction.guild.id });

    if (!activated) {
      return interaction.reply(`${interaction.user} **>> Ghost ping detection isn't activated yet in this server!**`);
    }

    Activate.deleteOne({ guild_id: interaction.guild.id }, (err, result) => {
      if (err || result.deletedCount === 0) {
        console.error(err || 'Nothing deleted');
        return interaction.reply({ embeds: [db_fail] });
      }
      return interaction.reply({ embeds: [deactivated_embed] });
    });
  }
};
