const { MessageEmbed } = require('discord.js')
const { guildId, embedColor } = require('../config')

module.exports = {
    name: `add`,
    description: `Permet de créer une demande pour un utilisateur`,
    async execute(client, message, args) {
        if(!message.member.hasPermission(`MANAGE_GUILD`)) return message.channel.send(`Vous n'avez pas la permission d'utiliser cette commande.`)
        const user = message.mentions.members.first()
        if(!user) return message.channel.send(`Veuillez mentionner un utilisateur`)
        const reason = args.slice(1).join(" ")
        if(!reason) return message.channel.send(`Veuillez indiquer une raison.`)

        const guild = await client.guilds.cache.get(guildId)
        const category = guild.channels.cache.find(ch => ch.name === "Support MP" && ch.type === "category")
        if(!category) {
            guild.channels.create(`Support MP`, { type: "category" }) 
        }
        const hasChannel = guild.channels.cache.find(ch => ch.topic === user.user.id && ch.parentID === category.id && ch.type === "text") ? true : false
        if(hasChannel) return message.channel.send(`L'utilisateur a déjà une demande d'ouverte !`)
        guild.channels.create(user.user.username, { type: "text", topic: user.user.id, parent: category, permissionOverwrites: [
            {
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                id: `772218791429668896`
            },
            {
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                id: `788454402218131467`
            },
            {
                deny: ['VIEW_CHANNEL'],
                id: guild.roles.everyone.id
            }
        ] })
        .then(ch => {
            const embed = new MessageEmbed()
            .setTitle(`Support MP`)
            .setDescription(`Ticket ouvert par ${message.author} (\`${message.author.tag}\`) pour ${user} (\`${user.user.tag}\`)`)
            .addField(`Message :`, reason ? reason : "Aucun message.")
            .setColor(embedColor)
            if(message.attachments.size > 0) {
                embed.setImage(message.attachments.first().proxyURL)
            }
            embed.setTimestamp()
            if(message.content.length > 1023) {
                embed.fields[0].value = "Le message envoyé est trop long. (Voir message suivant)"
            }
            ch.send(embed).then(() => {
                if(message.content.length > 1023) {
                    ch.send(`${reason}`).then(() => {
                        user.user.send(`Bonjour **${user.user.username}**, et merci de nous avoir contactés.\n\nVotre demande a bien été ouverte. Le staff vous répondra dès que possible. Pour des raisons de confidentialités et de sûreté, seul les administrateurs et les couronnes ont accès à votre demande. Une fois votre demande résolu, vous recevrez un message vous informant de la fermeture de votre ticket.\n\n__Pour finir, voici quelques informations concernant les réactions du bot :__\n> **✅ Signifie que le message a été envoyé avec succès**\n> **❌ Signifie que le message n'a pas pu être envoyé.**\n**VEUILLEZ GARDER VOS MESSAGES PRIVÉS DURANT TOUTE LA DURÉE DE VOTRE DEMANDE, AUQUEL CAS VOTRE DEMANDE SERA FERMÉ SI JE NE SUIS PLUS CAPABLE DE VOUS ENVOYER UN MESSAGE**`)
                    })
                } else {
                    message.author.send(`Bonjour **${user.user.username}**, et merci de nous avoir contactés.\n\nVotre demande a bien été ouverte. Le staff vous répondra dès que possible. Pour des raisons de confidentialités et de sûreté, seul les administrateurs et les couronnes ont accès à votre demande. Une fois votre demande résolu, vous recevrez un message vous informant de la fermeture de votre ticket.\n\n__Pour finir, voici quelques informations concernant les réactions du bot :__\n> **✅ Signifie que le message a été envoyé avec succès**\n> **❌ Signifie que le message n'a pas pu être envoyé.**\n**VEUILLEZ GARDER VOS MESSAGES PRIVÉS DURANT TOUTE LA DURÉE DE VOTRE DEMANDE, AUQUEL CAS VOTRE DEMANDE SERA FERMÉ SI JE NE SUIS PLUS CAPABLE DE VOUS ENVOYER UN MESSAGE**`)
                }
            })
        })
        .catch(err => {
            console.log(err)
            message.author.send(`J'ai n'ai pas pu créer de salon. Veuillez ré-essayer ou contacter le staff`)
        })
    }
}