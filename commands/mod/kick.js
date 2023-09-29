import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('kick')
		.addUserOption(usr => 
			usr.setName("target")
			.setDescription("set the target to kick!")
			.setRequired(true)
		)
		.addStringOption(reason =>
			reason
			.setName("reason")
			.setDescription("set the reason for kicking user")
			.setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDescription('Kicks a user!')
		,
	async execute(interaction, client, db) {
		const target = interaction.options.getUser("target")
		const reason = interaction.options.getString("reason")
		await interaction.guild.members.kick(target);
		await interaction.reply(`${interaction.user} kicked ${target} for ${reason}`)
	},
};
