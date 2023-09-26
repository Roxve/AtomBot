const { addButton, getButtons } = require("../../etc/vars");

const { SlashCommandBuilder, ActionRowBuilder,PermissionFlagsBits, ComponentBuilder, MessageActionRow, MessageButton, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-role-button')
		.addRoleOption( opt =>
			opt
			.setName("role")
			.setRequired(true)
			.setDescription("role to give")
		)
		.addStringOption( opt => opt
			.setName('text')
			.setRequired(true)
			.setDescription("sets the button name")
		)
		.addStringOption( opt =>
			opt
			.setName("message_id")
			.setRequired(true)
			.setDescription("msg to add button to")
		)
		.setDescription('add a button which gaves roles by click on on a bot message created by (/create-role-msg)!')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, client, db) {
		const msg = interaction.options.getString("message_id")
		const role = interaction.options.getRole("role")
		const name = interaction.options.getString("text")

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
			
		const button =
			new ButtonBuilder()
				.setCustomId(`${await getButtons(db)}${msg}_role_${role.id}`)
				.setLabel(name)
				.setStyle(ButtonStyle.Primary)
		
		addButton(db);

		if(components.length === 0) {
			components.push( new ActionRowBuilder().addComponents(button) )
		}
		else {
			if(components[components.length - 1].components.length === 5) {
				components.push(new ActionRowBuilder().addComponents(button))
			}
			else {
				const NewActionRow = new ActionRowBuilder()
					.addComponents(
						...components[components.length - 1].components,
						button
					)
				components[components.length - 1].components = NewActionRow.components;
			}
		}
		console.log(components);
			
		message.edit({ content: message.content, components })
		await interaction.reply({ content: 'added a button succesfully!', ephemeral: true, embeds: []});
	},
};
