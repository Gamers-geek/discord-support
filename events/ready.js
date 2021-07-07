module.exports = {
    name: `ready`,
    once: false,
    async execute(client) {
        console.log(`${client.user.username} ready !`)
        client.user.setActivity({ type: "STREAMING", url: "https://twitch.tv/olphedia", name: "support -> MP"})
    }
}