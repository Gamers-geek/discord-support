const { MessageEmbed } = require("discord.js")
const { prefix, guildId, embedColor } = require("../config")

module.exports = {
    name: `message`,
    once: false,
    async execute(message, client) {
        if(message.channel.type === "dm" || message.author.id === client.user.id || message.content.toLowerCase().startsWith(prefix)) return
        if(client.collectors.has(message.channel.id)) return
        const guild = await client.guilds.cache.get(guildId)
        const category = guild.channels.cache.find(ch => ch.name === "Support MP" && ch.type === "category")
        if(message.channel.parentID !== category.id) return
        const getMember = message.channel.topic ? message.guild.members.cache.get(message.channel.topic) : null
        if(!getMember) return message.channel.send(`Je ne parviens pas à trouver le membre qui a créé cette demande. Veuillez vous assurer que le membre n'a pas quitté le serveur ou que le sujet du salon n'a pas été modifié.`)
        const member = getMember
        const embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        .setDescription(message.content ? message.content : "Aucun message.")
        .setColor(embedColor)
        if(message.attachments.length > 0) {
            embed.setImage(message.attachments.first().proxyURL)
        }
        embed.setTimestamp()
        member.user.send(`**Vous avez reçu une réponse :**`, embed)
        .then(() => {
            message.react(`✅`)
        })
        .catch(err => {
            message.react(`❌`)
        })
    }
}