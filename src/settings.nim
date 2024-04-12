import dimscmd, dimscord
import os
import options, asyncdispatch
const token* =  getEnv("TOKEN")


let discord* {.mainClient.} = newDiscordClient(token) 

let cmd* = discord.newHandler() 
