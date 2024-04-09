import dimscord, asyncdispatch
# import dimscmd
import json
import strutils
import settings
import options

proc reply*(i: Interaction, msg: string) {.async.} =
    echo i
    let response = InteractionResponse(
        kind: irtChannelMessageWithSource,
        data: some InteractionApplicationCommandCallbackData(
            content: msg
        )
    )
    await discord.api.createInteractionResponse(i.id, i.token, response) 
     
proc reply*(m: Message, msg: string) {.async.} =
    discard await discord.api.sendMessage(m.channelId, msg)
    
include cmds


proc onDispatch(s: Shard, evt: string, data: JsonNode) {.event(discord).} =
    echo data.pretty()

proc onReady (s: Shard, r: Ready) {.event(discord).} =
    await cmd.registerCommands()
    echo "Ready"

proc interactionCreate (s: Shard, i: Interaction) {.event(discord).} =
    discard await cmd.handleInteraction(s, i)

proc messageCreate (s: Shard, msg: Message) {.event(discord).} =
    if msg.author.bot: return 
    
    let handled = await cmd.handleMessage("?", s, msg)
    if msg.content.startsWith('?') and not handled:
        msg.content.removePrefix('?')
        let cmd = msg.content;
        let err = fmt("unknown command {cmd}, use command ?help for commands")        
        await msg.reply(err)
waitFor discord.startSession()
