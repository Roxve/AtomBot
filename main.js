import { Client, Events, Collection, GatewayIntentBits } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { QuickDB } from 'quick.db';
import { fileURLToPath } from 'url';
import { ChatGPTAPI } from 'chatgpt';
import { exec } from 'child_process';

const token = process.env["token"]
const apiKey = process.env["apiKey"]

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const db = new QuickDB();
//init the ai api
const api = new ChatGPTAPI({
	apiKey,
	apiBaseUrl : "https://api.pawan.krd/v1",
	completionParams: {
		model: "pai-001-beta"
	}
})
const client = new Client({intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.MessageContent, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.GuildPresences, 
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.DirectMessages
]});

(async () => {
    // Init the database, this is always needed!
    await db.init();
})();

client.commands = new Collection();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("messageCreate", msg => {
	console.log(`message => ${msg.content} by ${msg.author}`);
  if (msg.content === ".ping") {
    msg.reply(`Pong! sent message in ${Date.now() - msg.createdTimestamp}ms , ping is ${client.ws.ping}'ms`);
  }
})

// any file in SCommands is a vaild slash command


// reading slash commands
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = await import(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		client.commands.set(command.default.data.name, command.default);
		
	}
}


// executing interactions
client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction, client, db, api);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
	} else if(interaction.isButton()) {
		const id = interaction.customId
		if(id.includes("role_")) {
			const _index = id.indexOf("role_");
			const roleID = id.substring(_index).substring(5);
			console.log(id)
			console.log(roleID);
			const role = interaction.guild.roles.cache.get(roleID);

			if(!role) {
				await interaction.reply({ content: `role not found ask the server owner to update!`, ephemeral: true })
				return;
			}


			if(!interaction.member.roles.cache.has(roleID)) {
				interaction.member.roles.add(role)
					.then( async () => {
							await interaction.reply({ content: `you now have the ${role.name} role!`, ephemeral: true })
					})
					.catch( async () => {
							await interaction.reply({ content: `cannot give role ${role.name} notify the server owner!` })	
					})
			} else {
				interaction.member.roles.remove(role).then( async () => {
						await interaction.reply({ content: `removed the ${role.name} role from you!`, ephemeral: true })
				})
				.catch( async() => {
						await interaction.reply({ content: `cannot remove the role ${role.name} notify the server owner!` })
				})
		}
	} else {
			await interaction.reply({ content: "error unknown interaction please report this!", ephemeral: true });
	}
 }
});
exec(
`curl --location --request POST 'https://api.pawan.krd/resetip' \> --header 'Authorization: Bearer ${apikey}`)

client.login(token);
//...Discord Bot Code Above ^^

const express = require('express')
const app = express();
const port = 3000;
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
