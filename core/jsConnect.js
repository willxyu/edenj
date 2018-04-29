/*
  Jyve Connect
   handles connecting, disconnecting of Jyve client
   
  requires
   console.log => log
   jm
    .receive
   jo
    .address
   ju
    .interval
   jv
    .connected, .lines, .packets, .sessionTime
   WebSocket
   $
   ~ui
    .connect

  uses:
   document
   #output
   .logo
   css
    sysecho

  index:
   def jm
   jm
    .connect         connects to nominated address
    .open            onopen handler
    .close           onclose handler
 */
 
jm = typeof jm !== 'undefined' ? jm : {}

jm.connect = function(address,port) {
 var address = address || jo.address
 w = new WebSocket('wss://'+address,'binary')
 // w = new WebSocket('ws://'+address,'binary')
 w.binaryType = 'arraybuffer'
 w.onopen    = jm.open
 w.onmessage = jm.receive
 w.onclose   = jm.close
}

jm.open = function(e) {
 jo.address = w.url.replace('ws://','')
 log('Connected to ws://'+jo.address+' successfully.')
 jv.sessionTime = new Date()
 jv.connected   = true
 // if (ui && ui.connect) { ui.connect() }
}

jm.close = function(e) {
 var address = jo.address
 var msg = 'Disconnected from server: ws://'+address
 log(msg+'.')
 jm.print(' <span class="sysecho">'+msg+'</span><br>')
 
 jv.connected = false
 jv.handshake = 0
 
 var d = ju.interval(jv.sessionTime, new Date())
 var s = ''
 s += d.days + ' days '
 s += d.hrs  + ' hrs '
 s += d.mins + ' mins '
 s += d.secs + ' secs '
 s += d.msecs+ ' msecs'
 jm.print('   <span class="sysecho">Session duration : '+s         +'</span><br>')
 jm.print('   <span class="sysecho">Packets processed: '+jv.packets+'</span><br>')
 jm.print('   <span class="sysecho">Lines processed  : '+jv.lines  +'</span><br>')
 jv.packets = 0
 jv.lines   = 0
 $('#output').scrollTop(document.getElementById('output').scrollHeight) // !important
 if (ui && ui.disconnect) { ui.disconnect() }
}
