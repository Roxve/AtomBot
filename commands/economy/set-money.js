import { CreateProfile } from '../../etc/CreateProfile.js';
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import discord from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('set-money')
		.addUserOption(opt =>
			opt
			.setName('user')
			.setRequired(true)
			.setDescription("the user to set their money")
		)
		.addNumberOption( opt =>
			opt
			.setName('money')
			.setRequired(true)
			.setDescription("the amount of money to set")
		)
		.setDescription('sets a user moeny!')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	,
	async execute(interaction, client,db) {

		const user = interaction.options.getUser('user')
		const amount = interaction.options.getNumber('money')

		const id = `${interaction.guildId}_${user.id}`
		const isID = await db.get(`${id}`)

		if (!isID) { await CreateProfile(db, id) }


		await db.set(`${id}.money`, amount)
		
		
		await interaction.reply(`${interaction.user} changed ${user}'s money to ${amount} ☑️`);
	},
};
