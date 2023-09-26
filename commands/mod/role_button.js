const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-role-msg')
		.addStringOption( opt =>
			opt
			.setName("message")
			.setRequired(true)
			.setDescription("msg to send")
		)
		.setDescription('Creates a message which gaves roles by click on its buttons!')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, client, db) {
		const msg = interaction.options.getString("message")
		interaction.channel.send(msg)
		await interaction.reply({ content: 'sent message in this channel (use /add-button-role (msg id) to add a button)!', ephemeral: true, embeds: []});
	},
};
