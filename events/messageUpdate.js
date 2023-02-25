const Discord = require('discord.js')
module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage, client) {
        if (oldMessage.author.bot) return
        if (!oldMessage.content) return
        const regex = /<@!?(1|\d{17,19})>/
        if (!oldMessage.guild.me.permissionsIn(oldMessage.channel).has(Discord.Permissions.FLAGS.SEND_MESSAGES)){
          return
        }else{
          if(oldMessage.content.match(regex) || oldMessage.content.match('@everyone')){
              if(newMessage.content.match(regex) || newMessage.content.match('@everyone')){
                return
              }
              console.log(`${oldMessage.author.username} updated ghost pinged message in ${oldMessage.channel} in ${oldMessage.guild}`)
              const embed = new Discord.MessageEmbed()
              .setColor('RED')
              .setAuthor(oldMessage.author.username,  oldMessage.author.displayAvatarURL)
              .setDescription(`Well well well, <@${oldMessage.author.id}> decided to edit their ghost pinged message...`)
              .addFields(
                {name: 'Their OldMessage was', value: `${oldMessage.content}`},
                {name: 'Their NewMessage ', value: `${newMessage.content}`}
              )
              oldMessage.channel.send({embeds: [embed]})
            }
        }
    },
}