const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction, client, db) {
		await interaction.reply(`Pong! sent message in ${Date.now() - interaction.createdTimestamp}ms, ping is ${client.ws.ping}ms`);
	},
};
