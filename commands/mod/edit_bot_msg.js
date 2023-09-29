import { addButton, getButtons } from '../../etc/vars.js';

import {
    SlashCommandBuilder,
    ActionRowBuilder,
    PermissionFlagsBits,
    ButtonBuilder,
    ButtonStyle,
} from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('edit-bot-msg')
		.addStringOption( opt =>
			opt
			.setName("message_id")
			.setRequired(true)
			.setDescription("msg to remove button from")
		)
		.addStringOption( opt => opt
			.setName("new_content")
			.setRequired(true)
			.setDescription("new message content")
		)	
		.setDescription('edits a bot message!')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, client, db) {
		const msg = interaction.options.getString("message_id")
		

		const fetched_message = await interaction.channel.messages.fetch({ around: msg, limit: 1 })
		
		const [_key, message] = fetched_message.entries().next().value;

		console.log(fetched_message);
		if(!message) { 
				await interaction.reply({ content: 'message not found!', ephemeral: true, embeds: []});
				return; 
		}

		if(!message.author.bot) {
			await interaction.reply({ content: "message not by bot!", ephemeral:true });
			return;
		}
		const new_content = interaction.options.getString("new_content");

		message.edit({ content: new_content, components: message.components, embeds: message.embeds });

		await interaction.reply({ content: 'edited a message succesfully!', ephemeral: true, embeds: []});
	},
};
