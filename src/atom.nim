import dimscord, asyncdispatch
# import dimscmd
import json
import strutils
import settings
import options

proc reply_embed(name: string, icon: string, msg: string): Embed =
    let author = EmbedAuthor(name: name, icon_url: some icon)
    let footer = EmbedFooter(text: "made by @_0bytes aka Rŭxve")
    Embed(author: some author, description: some msg, footer: some footer)

proc reply*(i: Interaction, msg: string) {.async.} =     
    let embed = reply_embed(i.member.get.user.username, i.member.get.user.avatarUrl("png", 1024), msg)
    echo i
    let response = InteractionResponse(
        kind: irtChannelMessageWithSource,
        data: some InteractionApplicationCommandCallbackData(
            embeds: @[embed]
        )
    )
    await discord.api.createInteractionResponse(i.id, i.token, response) 
     
proc reply*(m: Message, msg: string) {.async.} =
    let embed = reply_embed(m.author.username, m.author.avatarUrl("png", 1024), msg)

    discard await reply(m, "", @[embed], mention = true)
    
include cmds


# proc onDispatch(s: Shard, evt: string, data: JsonNode) {.event(discord).} =
#     echo data.pretty()

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
