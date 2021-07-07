const { prefix } = require('../config')

module.exports = {
    name: `message`,
    once: false,
    async execute(message, client) {
        if(message.author.bot) return
        if(!message.content.startsWith(prefix)) return
        if(!message.guild) return

        const args = message.content.slice(prefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()
        const command = client.commands.get(commandName)

        if(!command) return

        try {
            command.execute(client, message, args)
        } catch(err) {
            message.channel.send(`Il y a eu une erreur...`)
            console.error(err)
        }
    }
}