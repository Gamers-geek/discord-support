const { MessageEmbed } = require("discord.js")
const { embedColor } = require("../config")

module.exports = {
    name: `message`,
    once: false,
    async execute(message, client) {
        if(message.channel.type !== "dm" || message.author.id === client.user.id) return
        const guild = await client.guilds.cache.get("772213904834166805")
        const category = guild.channels.cache.find(ch => ch.name === "Support MP" && ch.type === "category")
        if(!category) {
            guild.channels.create(`Support MP`, { type: "category" }) 
        }
        const hasChannel = guild.channels.cache.find(ch => ch.topic === message.author.id && ch.parentID === category.id && ch.type === "text") ? true : false
        if(hasChannel) {
            const ch = guild.channels.cache.find(ch => ch.topic === message.author.id && ch.parentID === category.id && ch.type === "text")
            ch.send(`${message.content}`)
            .then(() => {
                message.react(`✅`)
            })
            .catch(err => {
                message.react(`❌`)
            })
        } else {
            guild.channels.create(message.author.username, { type: "text", topic: message.author.id, parent: category, permissionOverwrites: [
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
                .setDescription(`Ticket ouvert par ${message.author} (\`${message.author.tag}\`)}`)
                .addField(`Message :`, message.content ? message.content : "Aucun message.")
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
                        ch.send(`${message.content}`).then(() => {
                            message.author.send(`Bonjour ${message.author.username}, et merci de nous avoir contactés.\nVotre demande a bien été ouverte. Le staff vous répondra dès que possible. Pour des raisons de confidentialités et de sûreté, seul les administrateurs et les couronnes ont accès à votre demande. Une fois votre demande résolu, vous recevrez un message vous informant de la fermeture de votre ticket.\nPour finir, voici quelques informations concernant les réactions du bot :\n> ✅ Signifie que le message a été envoyé avec succès\n> ❌ Signifie que le message n'a pas pu être envoyé.\n**VEUILLEZ GARDER VOS MESSAGES PRIVÉS DURANT TOUTE LA DURÉE DE VOTRE DEMANDE, AUQUEL CAS VOTRE DEMANDE SERA FERMÉ SI JE NE SUIS PLUS CAPABLE DE VOUS ENVOYER UN MESSAGE`)
                        })
                    } else {
                        message.author.send(`Bonjour **${message.author.username}**, et merci de nous avoir contactés.\n\nVotre demande a bien été ouverte. Le staff vous répondra dès que possible. Pour des raisons de confidentialités et de sûreté, seul les administrateurs et les couronnes ont accès à votre demande. Une fois votre demande résolu, vous recevrez un message vous informant de la fermeture de votre ticket.\n\n__Pour finir, voici quelques informations concernant les réactions du bot :__\n> **✅ Signifie que le message a été envoyé avec succès**\n> **❌ Signifie que le message n'a pas pu être envoyé.**\n**VEUILLEZ GARDER VOS MESSAGES PRIVÉS DURANT TOUTE LA DURÉE DE VOTRE DEMANDE, AUQUEL CAS VOTRE DEMANDE SERA FERMÉ SI JE NE SUIS PLUS CAPABLE DE VOUS ENVOYER UN MESSAGE**`)
                    }
                })
            })
            .catch(err => {
                message.author.send(`J'ai n'ai pas pu créer de salon. Veuillez ré-essayer ou contacter le staff`)
            })
        }
    }
}