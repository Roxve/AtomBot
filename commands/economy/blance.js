import { CreateProfile } from '../../etc/CreateProfile.js';
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import discord from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('balance')
		.addUserOption(opt =>
			opt
			.setName('user')
			.setRequired(false)
			.setDescription("the user to show balance of")
		)
		.setDescription('shows a user balance!'),
	async execute(interaction, client,db) {

		const user = interaction.options.getUser('user') ?? interaction.user
		const id = `${interaction.guildId}_${user.id}`
		const isID = await db.get(`${id}`)

		if (!isID) { await CreateProfile(db, id) }


		const money = await db.get(`${id}.money`)
		const bank = await db.get(`${id}.bank`)
		
		const reply = new EmbedBuilder()
			.setColor(0x0099FF)
			.setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL()}` })
			.addFields(
				{ name: "Money:",value: `🪙 ${money}` },
				{ name: "Bank:",value: `🏦 ${bank}` },
				{ name: "Total:", value: `💰 ${money + bank}`}
			)
		await interaction.reply({ content: '', ephemeral: false, embeds: [reply]});
	},
};
