const { CreateProfile } = require("../../etc/CreateProfile.js")

const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const discord = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deposit')
		.addNumberOption( opt =>
			opt
			.setName('amount')
			.setRequired(false)
			.setDescription("the amount of money to set")
		)
		.setDescription('deposit money to your bank!')
	,
	async execute(interaction, client,db) {

		const user = interaction.user;

		const id = `${interaction.guildId}_${user.id}`
		const isID = await db.get(`${id}`)

		if (!isID) { await CreateProfile(db, id) }
		const amount = interaction.options.getNumber('amount') ?? await db.get(`${id}.money`);
		const user_money = await db.get(`${id}.money`)
		
		if(amount > user_money) { await interaction.reply(`cannot deposit ${amount} to your bank...`); return; }
		
		await db.add(`${id}.bank`, amount)
		await db.set(`${id}.money`, user_money-amount)
		
		
		await interaction.reply(`deposited ${amount} of ${user}'s money to bank`);
	},
};
