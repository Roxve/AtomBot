import dimscmd
import std/macros

macro add(name: static[string]; desc: static[string]; callback: untyped; args: varargs[untyped]): untyped =

    let comment = newCommentStmtNode(desc)
    
    var doArgs = newNimNode(nnkFormalParams)
    let empty = newNimNode(nnkEmpty)    
    doArgs.add empty 
    for arg in args:
        arg.expectKind nnkExprColonExpr
        arg.expectLen 2
        let id = newNimNode(nnkIdentDefs)
        id.add arg[0]
        id.add arg[1]
        id.add empty
        echo id.treeRepr
        
        doArgs.add id

    var finish = quote do: 
        cmd.addChat(`name`) do ():
            `callback`(msg)
        cmd.addSlash(`name`) do ():
            `comment`
            `callback`(i)
    finish[0][2][3] = doArgs
    finish[1][2][3] = doArgs
    
    result = finish
template ping(i) = 
    await i.reply(fmt"pong! replied in {s.latency}ms")

add("ping", "replys with pong", ping)
