import dimscmd

template ping(i) = 
    await i.reply(fmt"pong! replied in {s.latency}ms")

cmd.addSlash("ping") do (): 
    ## replys with pong!
    i.ping

cmd.addChat("ping") do ():
    msg.ping
