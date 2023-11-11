from setup import *


@bot.slash_command(description="displays bot ping!")
async def ping(ctx):
    await reply(ctx, f"pong! ping is {round(bot.latency * 1000)}ms!")

@bot.slash_command(description="displays help")
async def help(ctx): 
    commands = [(c.name, c.description) for c in bot.commands]  
    command_list = ""
    for name, desc in commands:
        command_list += f"\n- /{name} -> {desc}"
    await reply(ctx, content=command_list)
