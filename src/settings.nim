import dimscmd, dimscord
import os
import options, asyncdispatch
const token* =  getEnv("TOKEN")
let discord* = newDiscordClient(token) 

let cmd* = discord.newHandler() 
