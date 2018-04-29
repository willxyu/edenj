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

 +alias +n core.sys.showtriggers
  +p ^\\.str$
  +do
     var s  = ''
     var c  = 0
     for (var k in jt.trigs) {
      c += 1
      s += '\\n<span class="mute">' + '(' + lpad(c,4) + ') '
      if (typeof jt.trigs[k].name == 'string' && jt.trigs[k].name.length >= 1) {
       s += rpad(jt.trigs[k].name,20) + ':: '
      }
      s += '<span class="normal">' + jt.trigs[k].pattern + '</span></span>' }
     jprint(s)
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