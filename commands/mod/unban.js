const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.addUserOption(usr => 
			usr.setName("target")
			.setDescription("set the target to unban! (if not show enable dev options and paste userid)")
			.setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDescription('fast unbans an accidently banned user!')
		,
	async execute(interaction, client, db) {
		const target = interaction.options.getUser("target")
		const reason = interaction.options.getString("reason")
		await interaction.guild.members.unban(target);
		await interaction.reply(`${interaction.user} unbanned ${target}`)
	},
};
