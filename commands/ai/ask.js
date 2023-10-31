import { SlashCommandBuilder } from 'discord.js';
import { ChatGPTAPI } from 'chatgpt';

export default {
	data: new SlashCommandBuilder()
		.setName('ask')
		.addStringOption(opt => opt
			.setName("question")
			.setRequired(true)
			.setDescription("the question?")
		)
		.setDescription('ask ai a question!'),
	async execute(interaction, client, db, api) {
		const question = interaction.options.getString("question")
		await interaction.deferReply();
		  
		const res = await api.sendMessage(question, {
			parentMessageId: await db.get(`${interaction.user.id}.aiID`) ?? undefined,
			systemMessage: `You are atom AI, a large language model trained by atonix. 
      You answer as concisely as possible for each response, if its programming related you add specifc code tag to the snippet. 
      Current date: ${new Date().toISOString()}
			USER (actual name please refer to them as that) : ${interaction.user.username}\n\n`,
			/* onProgress: async (partialRes) => await interaction.editReply(partialRes.text) */
		})
		console.log(interaction.user.id)
		console.log(await db.get(`${interaction.user.id}.aiID`))
		
		await db.set(`${interaction.user.id}.aiID`, res.id)
		console.log(await db.get(`${interaction.user.id}.aiID`))
		await interaction.editReply(res.text);
	},
};
