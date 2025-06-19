const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const Discord = require('discord.js');
const Redirect = require('../models/Redirects');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('redirect')
    .setDescription("Redirects bot's messages to a particular channel")
    .addChannelOption(option =>
      option.setName('redirect_channel')
        .setDescription('The channel to set as the redirect channel')
        .setRequired(true)
    ),

  async execute(interaction) {
    const unauthorized = new Discord.MessageEmbed()
      .setColor('FF0000')
      .setTitle(`**:x: Unauthorized!**`)
      .setDescription(`You are not authorized to use this command.`);

    const invalid_channel = new Discord.MessageEmbed()
      .setColor('FF0000')
      .setTitle(`**:x: Invalid Channel**`)
      .setDescription(`This command is only applicable for text channels`);

    const redirect_embed = new Discord.MessageEmbed()
      .setColor('FF0000')
      .setTitle(`**Redirect activated successfully!**`)
      .setDescription(`Now the bot will send messages in the redirected channel!`)
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

    const channel = interaction.options.getChannel('redirect_channel');
    if (channel.type !== 'GUILD_TEXT' && channel.type !== 0) {
      return interaction.reply({ embeds: [invalid_channel] });
    }

    Redirect.findOne({ guild_id: interaction.guild.id }, (err, settings) => {
      if (err) {
        console.error(err);
        return interaction.reply({ embeds: [db_fail] });
      }

      if (!settings) {
        settings = new Redirect({
          guild_id: interaction.guild.id,
          channel_id: channel.id,
        });
      } else {
        settings.channel_id = channel.id;
      }

      settings.save(err => {
        if (err) {
          console.error(err);
          return interaction.reply({ embeds: [db_fail] });
        }

        return interaction.reply({ embeds: [redirect_embed] });
      });
    });
  }
};
