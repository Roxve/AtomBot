import discord
from setup import *
from commands.etc import *
from commands.economy import *
from commands.mod import *
from flask import Flask
from threading import Thread

app = Flask('')

@app.route('/')
def main():
  return "Your Bot Is Ready"

def run():
  app.run(host="0.0.0.0", port=8000)

def keep_alive():
  server = Thread(target=run)
  server.start()

@bot.event
async def on_ready():
    print(f'logged in as {bot.user}')
    
    print("setup hook")
    bot.add_view(ButtonsView())
    # bot.add_dynamic_items(RoleButton)
@bot.event
async def on_message(msg):
    if msg.author.bot:
        return
    
@bot.event
async def on_interaction(interaction: discord.Interaction):
    if interaction.is_component():
        id: str = interaction.custom_id
        print(id)
        if id.startswith("role_"):
            role_id = int(id.replace("role_", ""))
            role = interaction.guild.get_role(role_id)
            if role in interaction.user.roles:
                try: 
                    await interaction.user.remove_roles(role)
                except:
                    await interaction.response.send_message(f"faild removing role, notify the server admin!",  ephemeral=True)
                else:
                    await interaction.response.send_message(f"🛑 removed role @{role.name} from your roles!", ephemeral=True)
            else:
                try:
                    await interaction.user.add_roles(role)
                except:
                    await interaction.response.send_message(f"faild removing role, notify the server admin!",  ephemeral=True)
                else:
                    await interaction.response.send_message(f"🎉 added role @{role.name} to your roles!", ephemeral=True)     
        else:
            await bot.process_application_commands(interaction)
    else:
        await bot.process_application_commands(interaction)
 
keep_alive()
bot.run(token)
print("Exit 0")
