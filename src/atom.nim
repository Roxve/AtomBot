import dimscord, asyncdispatch
import dimscmd
import options
import os
import json
import strutils


const token =  getEnv("TOKEN")
let discord = newDiscordClient(token) 

let cmd = discord.newHandler() 

proc reply(i: Interaction, msg: string) {.async.} =
    echo i
    let response = InteractionResponse(
        kind: irtChannelMessageWithSource,
        data: some InteractionApplicationCommandCallbackData(
            content: msg
        )
    )
    await discord.api.createInteractionResponse(i.id, i.token, response) 



cmd.addSlash("ping") do (): 
    ## replys with pong
    await i.reply("pong")

proc onDispatch(s: Shard, evt: string, data: JsonNode) {.event(discord).} =
    echo data.pretty()

proc onReady (s: Shard, r: Ready) {.event(discord).} =
    await cmd.registerCommands()
    echo "Ready"

proc interactionCreate (s: Shard, i: Interaction) {.event(discord).} =
    discard await cmd.handleInteraction(s, i)
waitFor discord.startSession()
