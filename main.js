const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const token = process.env['token']
const keepAlive = require("./server")

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
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


// executing slash commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, client, db);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

keepAlive();

client.login(token);
