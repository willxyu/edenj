var t = {}
t.aliases = `
 +alias +n core.duanathar
  +p ^dn$
  +do
     var s  = ''
         s += 'get wings from pack' + sp
         s += 'wear wings' + sp
         s += 'say duanathar' + sp
         s += 'remove wings' + sp
         s += 'put wings in pack' + sp
     fsend(s)
  -en

 +alias +n core.embraceFlame
  +p ^ef$
  +do
     var s  = ''
         s += 'embrace flame' + sp
     fsend(s)
  -en

 +alias +n core.follow
  +p ^f[ ]+(\\w+)$
  +do
     var s  = ''
         s += 'follow ' + matches[1] + sp
     fsend(s)
  -en

 +alias +n core.try
  +p ^try[ ]+(.*)$
  +do
     var s = ''
     var t = [
       'push',
       'pull',
       'touch',
       'open',
       'unlock',
       'light',
       'kick',
       'twist',
       'snap', ]
     for (var i=0; i<t.length; i++) {
       s += t[i] + ' ' + matches[1] + sp
     }
     bsend(s)
  -en

 +alias +n core.walkto
  +p ^wt[ ]+(.*)$
  +do
     var s  = ''
         s += 'walkto ' + matches[1] + sp
     fsend(s)
  -en
`

t.triggers = `
 +trigger +n core.afflicted
  +p ^You have been afflicted with (.*)\.$
  +do
     highlight(matches[1],'red')
  -en
 +trigger +n core.level-highlight
  +p ^You are level .* and (.*)% of the way to the next level\.$
  +do
     highlight(matches[1],'rgba(75,151,223,1)')
  -en
 +trigger +n core.gags
  +p ^You are not fallen or kneeling\.$
  +p ^You are already wielding that\.$
  +p ^Ahh, I am truly sorry, but I do not see anyone by that name here\.$
  +p ^You cannot see that being here\.$
  +p ^You detect nothing here by that name\.$
  +p ^I do not recognise anything called that here\.$
  +p ^Nothing can be seen here by that name\.$
  +p ^What do you wish to examine?
  +p ^Your queues are already empty\.$
  +do
     sub()
  -en
 +trigger +n core.gag-eqbal
  +p ^(.*) was added to your balance queue.$
  +p ^(.*) was added to your equilibrium queue.$
  +do
      highlight(matches[1],'rgba(155,100,100,1)')
      // sub()
  -en
 +trigger +n core.shop-autoadd
  +p ^[ ]+.*\\d+[ ]+.*[ ]+(\\d+)[ ]+(\\d+)gp$
  +do
     var quant = matches[1]
     var price = matches[2]
     var total = price * quant
     tagOn('   ' + total + ' g')
  -en
 +trigger +n core.ships-autoadd
  +p ^Fine[ ]+Provisions[ ]+(\\d+)[ ]+(\\d+)$
  +p ^Good[ ]+Provisions[ ]+(\\d+)[ ]+(\\d+)$
  +p ^Common[ ]+Provisions[ ]+(\\d+)[ ]+(\\d+)$
  +p ^Token[ ]+Stores[ ]+(\\d+)[ ]+(\\d+)$
  +do
     var price = matches[1]
     var count = matches[2]
     var total = price * count
     tagOn('   ' + total + ' g')
  -en
 +trigger +n core.date-change
  +p ^It is now the (.*) years after the fall of the Seleucarian Empire\.$
  +do
     highlight(matches[1],'orange')
  -en
`

t.scripts = `
 sp = typeof sp !== 'undefined' ? sp : '|'
`

t.secondaries = `
 sys
`

mods.register('core',t)
