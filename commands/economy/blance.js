const { CreateProfile } = require("../../etc/CreateProfile.js")

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const discord = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blance')
		.addUserOption(opt =>
			opt
			.setName('user')
			.setRequired(true)
			.setDescription("the user to show blance of")
		)
		.setDescription('shows a user blance!'),
	async execute(interaction, client,db) {

		const user = interaction.options.getUser('user')
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
