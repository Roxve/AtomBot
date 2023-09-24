const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.addUserOption(usr => 
			usr.setName("target")
			.setDescription("set the target to ban!")
			.setRequired(true)
		)
		.addStringOption(reason =>
			reason
			.setName("reason")
			.setDescription("set the reason for baning user")
			.setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setDescription('Bans a user!')
		,
	async execute(interaction, client,db) {
		const target = interaction.options.getUser("target")
		const reason = interaction.options.getString("reason")

		interaction.guild.members.ban(target, { reason: reason });
		await interaction.reply(`${interaction.user} banned ${target} for ${reason}`)
	},
};
