const { MessageEmbed } = require("discord.js")
const { closeEmbedColor, guildId } = require("../config")

module.exports = {
    name: `close`,
    description: `Ferme une demande en cours.`,
    async execute(client, message, args) {
        if(!message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`Vous n'avez pas la permission d'utiliser cette commande.`)
        const guild = await client.guilds.cache.get(guildId)
        const category = guild.channels.cache.find(ch => ch.name === "Support MP" && ch.type === "category")
        const channel = await message.mentions.members.first() ? guild.channels.cache.find(ch => ch.parentID === category.id && ch.topic === message.mentions.members.first().user.id) : message.channel.parentID !== category.parentID ? message.channel : null
        if(!channel) return message.channel.send(message.mentions.members.first() ? `Le membre que vous avez mentionné n'a pas de demande d'ouverte.` : `Le salon dans lequel vous vous trouvez n'est pas une demande.`)
        const msg = await message.channel.send(`Êtes vous sur de vouloir fermer cette demande ?`)
        const filter = (reaction, user) => {
            return user.id === message.author.id && ["✅", "❌"].includes(reaction.emoji.name)
        }
        msg.react(`✅`)
        msg.react(`❌`)
        msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] }).then(collected => {
            if(collected.first().emoji.name === "✅") {
                message.channel.send(`Veuillez indiquer le motif de fermeture de la demande.\nTapez \`cancel\` pour annuler la commande.`)
                const filter = msg => msg.author.id === message.author.id
                client.collectors.set(channel.id, true)
                message.channel.awaitMessages(filter, { time: 60000, errors: ['time'], max: 1 }).then(async collectedMsg => {
                    if(collectedMsg.first().content.toLowerCase() === "cancel") return message.channel.send(`Commande annulée.`).then(noneMsg => {
                        message.delete()
                        collectedMsg.first().delete()
                        msg.delete()
                        noneMsg.delete({ timeout: 5000 })
                    })
                    const motif = collectedMsg.first().content
                    await channel.send(`Fermeture de la demande dans 5 secondes...`)
                    const member = await guild.members.cache.find(member => member.id === channel.topic)
                    client.collectors.delete(channel.id)
                    if(!member) message.channel.send(`Je ne parviens pas à trouver le membre qui a créé cette demande.`)
                    const embed = new MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL({ dyanmic: true }))
                    .setTitle(`Votre demande a été fermée.`)
                    .setDescription(`Bonjour **${member.user.username}**\n__Nous vous informons que votre demande a été fermé pour le motif suivant :__\n${motif}`)
                    .setColor(closeEmbedColor)
                    .setTimestamp()
                    await member.user.send(embed)
                    channel.delete()
                })
            } else return message.channel.send(`Annulé.`).then(noneMsg => {
                message.delete()
                msg.delete()
                noneMsg.delete({ timeout: 5000 })
            })
        }).catch(err => {
            message.channel.send(`Vous avez pris trop de temps à répondre !`).then(noneMsg => {
                message.delete()
                msg.delete()
                noneMsg.delete({ timeout: 5000 })
            })
        })
    }
}