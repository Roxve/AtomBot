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
		.setName('remove-button')
		.addStringOption( opt =>
			opt
			.setName("message_id")
			.setRequired(true)
			.setDescription("msg to remove button from")
		)
		.addNumberOption( opt => opt
			.setName("row")
			.setRequired(false)
			.setDescription("row that has the button? a row is 5 buttons")
		)
		.addNumberOption( opt => opt
			.setName("button")
			.setRequired(false)
			.setDescription("button to remove?")
		)
		.setDescription('removes a button from a bot message created by (/create-bot-msg)!')
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

		const components = message.components ?? []
		if(components === []) {
			await interaction.reply({ content: "message doesnt have any buttons!", ephemeral: true });
			return;
		}

		let row = interaction.options.getNumber("row") - 1 ?? components.length - 1
		
		if(row === -1) {
			row = components.length - 1;
		}


		row = Math.abs(row)

		if(row > components.length - 1) {
			await interaction.reply({ content: `row ${row} not in message!`, ephemeral:true });
			return;
		}
		if(!components[row].components) {
			await interaction.reply({ content: `invaild row!`, ephemeral:true });
			return;
		}

		const button = interaction.options.getNumber("button") - 1 ?? components[row].components.length - 1
		if(button > components[row].components.length - 1) {
			await interaction.reply({ content: `button ${button} not in row ${row}!`, ephemeral: true })
			return
		}

		components[row].components.splice(button, 1);
		message.edit({ content: message.content, components })
		await interaction.reply({ content: 'removed a button succesfully!', ephemeral: true, embeds: []});
	},
};
