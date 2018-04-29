/*
  gmcp Handler
  requires:
    jm
     .logo
    jv
     .user
    jo
     .title
  uses:
     css
 */


gm = typeof gm !== 'undefined' ? gm : {}
gm.balanceClock     = gm.balanceClock || 0
gm.equilibriumClock = gm.equilibriumClock || 0
gm.decimalpoints    = 2

gm.balanceBracket   = '<span class="balBracket">'
gm.balanceColor     = '<span class="bal">'
gm.eqBracket        = '<span class="eqBracket">'
gm.eqColor          = '<span class="eq">'
gm.iconsrc          = './core/resources/icon.png'

gmcpUpdate = function(e) {
  switch (e) {
   case 'Room.Info':
    if (typeof b !== 'undefined') { b.gmcpArea(); b.act() }
    // if (cbu) { cbu.vars.players = []; cbu.refreshNames() }
    break;
   case 'Room.Players':
    if (typeof cui !== 'undefined') { cui.updateInroom('Players',gmcp.Room.Players); cui.refreshNames() }
    break;
   case 'Room.AddPlayer' :
    if (typeof cui !== 'undefined') { cui.updateInroom('AddPlayer',gmcp.Room.AddPlayer); cui.refreshNames() }
    break;
   case 'Room.RemovePlayer':
    if (typeof cui !== 'undefined') { cui.updateInroom('RemovePlayer',gmcp.Room.RemovePlayer); cui.refreshNames() }
    break;
   case 'Char.Vitals':
    gmcpBal()
    gmcpEqu()
    gm.health()
    gm.mana()
    if (typeof b !== 'undefined') { b.gmcpVitals(); b.act() }
    break;
   case 'Char.Status':
    gm.status()
    if (typeof me !== 'undefined') { me.gmcp.status() }
    if (typeof b !== 'undefined') { b.gmcpStatus() }
    break;
   case 'Char.StatusVars':
    break;
   case 'Char.Defences.List':
    break;
   case 'Char.Defences.Add':
    break;
   case 'Char.Defences.Remove':
    break;
   case 'Char.Afflictions.List':
    if (typeof me !== 'undefined') { me.gmcp.affs() }
    break;
   case 'Char.Afflictions.Remove':
    if (typeof me !== 'undefined') { me.gmcp.takeaff() }
    break;
   case 'Char.Afflictions.Add':
    if (typeof me !== 'undefined') { me.gmcp.giveaff() }
    break;
   case 'Char.Skills.Groups':
    break;
   case 'Char.Items.List':
    if (typeof b !== 'undefined') { b.gmcpList() }
    break;
   case 'Char.Items.Add':
    break;
   case 'Char.Items.Remove':
    break;
   case 'Char.Items.Update':
    break;
   case 'Comm.Channel.List':
    break;
   case 'Comm.Channel.Text':
    // if (ugm) { ugm.text() }
    // if (typeof chat !== 'undefined') { chat.packet() }
    break;
   case 'Comm.Channel.Start':
    break;
   case 'Comm.Channel.End':
    break;
   case 'IRE.Rift.List':
    break;
   case 'IRE.Rift.Change':
    break;
   default:
    log(e)
    break;
 }
}

gmcpBal = function() {
 var oldBal = gm.bal || '1'
 if (gmcp && gmcp.Char && gmcp.Char.Vitals && gmcp.Char.Vitals.bal) {
  gm.bal = gmcp.Char.Vitals.bal
  if (gmcp.Char.Vitals.bal == '1' && gmcp.Char.Vitals.bal != oldBal) {
   var now = new Date()
   var dif = now - gm.balanceClock
   dif = dif / 1000
   dif = jround(dif,gm.decimalpoints)
   dif = dif.toFixed(gm.decimalpoints)
   var s = gm.balanceBracket + '&ecolon;&Lang; Bal:</span> ' + gm.balanceColor + dif + 's</span>' + gm.balanceBracket + ' &Rang;&colone; </span><br >'
   s = '<span style="font-size: 14pt">' + s + '</span>'
   s = '<span class="mutrigger">&compfn;</span> ' + s
   if (jo.timestamp) {
    var tstmp = now.getTime()
    var mins  = now.getMinutes()
    var secs  = now.getSeconds()
    var mscs  = now.getMilliseconds()
    tstmp = ju.lpad(mins,2,'0') + ':' + ju.lpad(secs,2,'0') + ':' + ju.lpad(mscs,3,'0') + ' '
    s = '<span class="timestamp mute">'+tstmp+'</span>' + s
    s = s.replace('class="timestamp mute"', 'class="timestamp mute" style="font-family: Lekton"') 
   }
   jprint(s)
   // jprint('  '+gm.balanceBracket+'[ Bal:</span> '+gm.balanceColor +dif+'s</span>'+gm.balanceBracket+']</span><br>')
  } else if (gmcp.Char.Vitals.bal == '0' && oldBal == '1') {
   gm.balanceClock = new Date()
  }
 }
}

gmcpEqu = function() {
 var oldEq = gm.eq || '1'
 if (gmcp && gmcp.Char && gmcp.Char.Vitals && gmcp.Char.Vitals.eq) {
  gm.eq = gmcp.Char.Vitals.eq
  if (gmcp.Char.Vitals.eq == '1' && gmcp.Char.Vitals.eq != oldEq) {
   var now = new Date()
   var dif = now - gm.equilibriumClock
   dif = dif / 1000
   dif = jround(dif,gm.decimalpoints)
   dif = dif.toFixed(gm.decimalpoints)
   var s = gm.eqBracket + '&homtht;&sext; Equi:</span> ' + gm.eqColor + dif + 's</span>' + gm.eqBracket + ' &sext;&homtht;</span><br >'
   // s = '<span style="font-size: 14pt">' + s + '</span>'
   s = '<span class="mutrigger">&compfn;</span> ' + s
   if (jo.timestamp) {
    var tstmp = now.getTime()
    var mins  = now.getMinutes()
    var secs  = now.getSeconds()
    var mscs  = now.getMilliseconds()
    tstmp = ju.lpad(mins,2,'0') + ':' + ju.lpad(secs,2,'0') + ':' + ju.lpad(mscs,3,'0') + ' '
    s = '<span class="timestamp mute">'+tstmp+'</span>' + s
    s = s.replace('class="timestamp mute"', 'class="timestamp mute" style="font-family: Lekton"') 
   }
   // jprint(s)
   // jprint('  '+gm.eqBracket+'[  Eq:</span> '+gm.eqColor +dif+'s</span>'+gm.eqBracket+']</span><br>')
  } else if (gmcp.Char.Vitals.eq == '0' && oldEq == '1') {
   gm.equilibriumClock = new Date()
  }
 }
}

gm.status = function() {
 if (!gmcp.Char) { return }
 if (!gmcp.Char.Status) { return }
 var main    = jo.main || 'Jyve'
 var oldUser = jv.user
 
 jv.user = gmcp.Char.Status.name
 jv.class = gmcp.Char.Status.class
 if (oldUser != jv.user) {
  jm.logo()
  if (jo && jo.title == 'user') {
   document.title = jo.main+' - '+jv.user }
 }
}

gm.health = function() {
 if (!gmcp.Char) { return }
 if (!gmcp.Char.Vitals) { return }

 var t   = gmcp.Char.Vitals
 var f   = Math.floor
 var hp  = f(t.hp) 
 var mhp = f(t.maxhp)

 if (typeof cui !== 'undefined' && typeof cui.updateHealth == 'function') { cui.updateHealth(hp, mhp) }

 document.title = jv.user + ' - '+hp+' ('+jround(hp/mhp * 100,2)+'%)'

 function changeIcon(src) {
  var link  = document.createElement('link'),
       old  = document.getElementById('dynamic-favicon')
  link.id   = 'dynamic-favicon'
  link.rel  = 'shortcut icon'
  link.href = src
  if (old) { document.head.removeChild(old) }
  document.head.appendChild(link)
  // document.getElementsByTagName('head')[0].appendChild(link)
 }
 
 var older = gm.iconsrc
 if (hp/mhp >= 0.85) { gm.iconsrc = './core/resources/icon.png'   }
 if (hp/mhp <  0.85) { gm.iconsrc = './core/resources/icon_.png'  }
 if (hp/mhp <  0.65) { gm.iconsrc = './core/resources/icon__.png' }
 if (gm.iconsrc != older) {
  changeIcon(gm.iconsrc)
 }
}

gm.mana = function() {
 if (!gmcp.Char) { return }
 if (!gmcp.Char.Vitals) { return }

 var t   = gmcp.Char.Vitals
 var f   = Math.floor
 var mp  = f(t.mp) 
 var mmp = f(t.maxmp)

 if (typeof cui !== 'undefined' && typeof cui.updateMana == 'function') { cui.updateMana(mp, mmp) }
}