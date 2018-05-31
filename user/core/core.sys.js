var t = {}

t.scripts = `
`

t.triggers = `
`

t.aliases = `
 +alias +n core.sys.echo
  +p ^\\.echo[ ]+(.*)$
  +do
     var s  = matches[1]
     echoCommand(s)
  -en
 +alias +n core.sys.timestamp
  +p ^\\.ts$
  +do
     if (jo.timestamp) {
      jo.timestamp = false
      jm.timestampOff()
     } else {
      jo.timestamp = true
      jm.timestampOn()
     }
  -en
`

mods.append('core',t)