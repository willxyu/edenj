/*
  Jyve Receiver
   handles binary stream; alter at your own risk
   
  requires
   console.log => log
   fastdom
   jo
    .outputLim
   jv
    .wrapSeq
   jm
    .mods, .triggers
   jt
    .discover, .mods
   ju
    .clean, .clone, .key
   $

  uses:
   body, document
   #output
   css
    echo

  index:
   def jm
   def jv
   jm
    .receive         handles receiving data from server
    .elucidate
    .interpret
    .parse
   local
     adonize
 */

jm = typeof jm !== 'undefined' ? jm : {}

jt = typeof jt !== 'undefined' ? jt : {}
jt.mods          = typeof jt.mods          !== 'undefined' ? jt.mods        : []

jv = typeof jv !== 'undefined' ? jv : {}

jv.currentBuffer = typeof jv.currentBuffer !== 'undefined' ? jv.currentBuffer : 0
jv.GABuffer      = typeof jv.GABuffer      !== 'undefined' ? jv.GABuffer    : []
jv.GAIAC         = typeof jv.GAIAC         !== 'undefined' ? jv.GAIAC       : false
jv.GASender      = typeof jv.GASender      !== 'undefined' ? jv.GASender    : []
jv.gmcps         = typeof jv.gmcps         !== 'undefined' ? jv.gmcps       : []
jv.handshake     = typeof jv.handshake     !== 'undefined' ? jv.handshake   : 0
jv.lastpacket    = typeof jv.lastpacket    !== 'undefined' ? jv.lastpacket  : ''
jv.lastpackets   = typeof jv.lastpackets   !== 'undefined' ? jv.lastpackets : []
jv.lineMatched   = typeof jv.lineMatched   !== 'undefined' ? jv.lineMatched : false
jv.lineModify    = typeof jv.lineMatched   !== 'undefined' ? jv.lineModify  : false
jv.orphanMatch   = typeof jv.orphanMatch   !== 'undefined' ? jv.orphanMatch : ''
jv.perfProcess   = typeof jv.perfProcess   !== 'undefined' ? jv.perfProcess : 0
jv.perfRolling   = typeof jv.perfRolling   !== 'undefined' ? jv.perfRolling : 0
jv.pingStart     = typeof jv.pingStart     !== 'undefined' ? jv.pingStart   : 0
jv.pingTime      = typeof jv.pingTime      !== 'undefined' ? jv.pingTime    : 0
jv.rawLine       = typeof jv.rawLine       !== 'undefined' ? jv.rawLine     : ''
jv.listenOhmap   = typeof jv.listenOhmap   !== 'undefined' ? jv.listenOhmap : false
jv.ohmap         = typeof jv.ohmap         !== 'undefined' ? jv.ohmap       : []

gmcp = typeof gmcp !== 'undefined' ? gmcp : {}

jm.receive = function(e) {
 jv.perfProcess = new Date() // Performance Tracking
 var chunk = new Uint8Array(e.data)
 var ws = jv.wrapSeq
 var wl = jo.wrapLim
 
 // Div Length Limitations and Wrapping
 if (jv.wrapPage) {
  jv.currentBuffer = 0
  jv.wrapPage = false
  // measure the length
  var outj = $('#output')
   var wid = outj.css('width');  wid = ju.clean(wid)
   var hei = outj.css('height'); hei = ju.clean(hei)
   var top = outj.css('top');    top = ju.clean(top)
   var lef = outj.css('left');   lef = ju.clean(lef)

  if ( $('#output-'+ws).length) { $('#output-'+ws).remove() }
  $('#output').attr('id', 'output-'+ws).attr('class','hidden')
  jv.wrapSeq++

  if (jv.wrapSeq > wl) { jv.wrapSeq = 1 } // manipulate original variable
  var d = '' 
  $('#container').append('<div id="output"></div>')
  jm.draw()
  $('#output')
   .css('width',wid)
   .css('height',hei)
   .css('top',top)
   .css('left',lef)

  // handle lastpackets
  for (var i=0;i<jv.lastpackets.length;i++) {
   var t = jv.lastpackets[i]
   for (var k=0;k<t.length;k++) {
    jm.print(t[k])
   }
  }
  jv.lastpackets = []
  // jm.print(jv.lastpacket)
  fastdom.measure( function() {
   var h = document.getElementById('output').scrollHeight
   fastdom.mutate( function() {
    $('#output').scrollTop(h) }) })
 }
 
 var s = ''
 for (var i=0;i<chunk.length;i++) {
  var Char = chunk[i]
  var CharNext = chunk[i+1] || null
  if (jv.GAIAC && Char != 249)  { jv.GAIAC = false }
  if (Char === 255)             { jv.GAIAC = true }
  if (Char === 249 && jv.GAIAC) {
   jm.interpret()  // !important
   if (jv.scrollback) {
    fastdom.measure( function() {
     var h = document.getElementById('addenda').scrollHeight
     fastdom.mutate( function() {
      $('#addenda').scrollTop(h) }) })
   } else {
    fastdom.measure( function() {
     var h = document.getElementById('output').scrollHeight
     fastdom.mutate( function() {
      $('#output').scrollTop(h) }) })
   }
  } else {
   jv.GABuffer.push(Char)
  }
 }
 jv.packets++
 if (jv.currentBuffer >= jo.outputLim) {
  jv.wrapPage = true
  jm.print('<span class="echo">Warning: Re-rendering buffer on next packet.</span><br>')
  jm.print('<span class="echo">Warning: Re-rendering buffer on next packet.</span><br>')
  jm.print('<span class="echo">Warning: Re-rendering buffer on next packet.</span><br>')
 }
 // Performance Closure
  var now = new Date()
  var dif = now - jv.perfProcess
  if (dif != 0) {
   // log('(Performance): '+dif)
   var perf = jv.perfRolling 
   perf = perf * 3
   perf = perf + dif
   perf = perf / 4
   perf = Math.floor(perf)
   jv.perfRolling = perf
   // normalizes after 4
   $('#performance').text(perf)
  }
}

jm.interpret = function() {
 var adonize = jm.adonize
 var msgs = []
 if (jm.contains('IAC-WILL-GMCP')) {
  if (jv.handshake != 2) {
   log('(gmcp) Handshake incomplete. Sending Requests.')
   jv.GASender.push(adonize('IAC-DO-GMCP')) 
   jv.GASender.push(adonize('IAC-SB-GMCP-IRE.Rift.Request-IAC-SE'))
   jv.GASender.push(adonize('IAC-SB-GMCP-Core.Hello { "client": "jyve", "version": "1" }-IAC-SE'))
   jv.GASender.push(adonize('IAC-SB-GMCP-Char.Items.Inv-IAC-SE'))
   jv.GASender.push(adonize('IAC-SB-GMCP-Core.Supports.Set [ "Char 1", "Char.Skills 1", "Char.Items 1" ]-IAC-SE'))
   jv.GASender.push(adonize('IAC-SB-GMCP-Core.Supports.Add [ "Comm.Channel 1", "IRE.Rift 1", "Room 1", "IRE.Display 1" ]-IAC-SE'))
   jv.handshake = 1
  }
 }
 if (jm.contains('IAC-DO-TT')) { jv.GASender.push(adonize('IAC-WILL-TT')) }
 if (jm.contains('IAC-SB-TT-1-IAC-SE')) { jv.GASender.push(adonize('IAC-SB-TT-0-jyve-IAC-SE')) }
 jv.gmcps = jm.elucidate() // !important, strips out GMCP data
 jv.GASender.push(adonize('IAC-SB-GMCP-Core.Ping-IAC-SE'))
 for (var k=0;k<jv.GASender.length;k++) {
  var msg = jv.GASender[k]
  jm.Uint8(msg)
 }
 jv.GASender = []
 jm.parse() // !important
 jv.GABuffer = []
}

jm.parse = function() {
 var colorFlag = 0
 var data = ''
 // for (var v of jv.GABuffer) { if (!ju.key(jv.mapping,v)) { data += String.fromCharCode(v) } }
 for (var v of jv.GABuffer) { if (!jv.mappedKeys.includes(v)) { data += String.fromCharCode(v) } }

 var mcolr = data.match(/\<COLOR \#(\w+)\>(.*?)\<\/COLOR\>/g)
 if (mcolr) { for (var i=0;i<mcolr.length;i++) {
  var m = mcolr[i]
  m = m.replace(/\<COLOR \#(\w+)\>/,'<span style="color: #$1;">').replace(/\<\/COLOR\>/,'</span>')
  data = data.replace(mcolr[i],m)
 }}
 var mhref = data.match(/\<SEND HREF=\"(.*?)\"\>(.*?)\<\/SEND\>/g)
 if (mhref) { for (var i=0;i<mhref.length;i++) {
   var m = mhref[i]
   m = m.replace(/\<SEND HREF=\"(.*?)\"\>(.*?)\<\/SEND\>/,'<a href="#" onclick="jm.send(\'$1\')">$2</a>')
   data = data.replace(mhref[i],m)
 }}

 /*
 var murls = data.match(/([Hh]ttps?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?)/gi)
 if (murls) { for (var i=0;i<murls.length;i++) {
   var m = murls[i]
   m = m.replace(/(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?)/,'<span class="link"><a href="#" onclick="window.open(\'$1\')">$1</a></span>')
   data
 */
  
 data = data.replace(/\x01/g, '').replace(/\[4z/g, '') // .replace(/\x1B\[dz/g, '')       // strip ANSI tags
 data = data.replace(/\r/g,'')
 /*
 data = data.replace(/\x1B\[[\d;]+m/g, '')  // strip color ANSI tags - there shouldn't be any 
 data = data.replace(/\x1B/g, '')
 */

 var lines = data.split(/\n/)
 var outgoing = []
  var pxn = new Date()
  
 for (var k=0;k<lines.length;k++) {
  var currentTime = new Date()
  var line = lines[k]
  var s    = lines[k]
  jv.lineMatched = false
  var q = jm.handleTriggers(line) // !important; strip down to 'jm.handleTriggers(line)' without assignment as necessary

  // Not sure why we have orphan lines, but there you go
  if (s.match(/^\x1B\[((\d*);){0,2}(\d*)m$/g)) { 
   jv.orphanMatch = s
  } else if (s.match(/^$/g) && k == 0) {
   jv.orphanMatch = s
  } else {
   if (jv.orphanMatch.length > 0) { s = jv.orphanMatch + s; jv.orphanMatch = '' } 

   // Handle Colour!
   var ctags = s.match(/\x1B\[((\d*);){0,2}(\d*)m/g)
   var showTag = false
   if (ctags) {
    for (var p in ctags) {
     var m = ctags[p],
         n = m.replace('\x1B','').replace('[','').replace('m','').split(';')
     for (var j=0;j<n.length;j++) { n[j] = jv.attr[n[j]] }
     var o = n.join(' ')
     if (jv.lastBGColour && !n[1]) { o = o + ' ' + jv.lastBGColour }
     if (showTag) {
      s = s.replace(m, m+'</span><span class="'+o+'">')
     } else {
      s = s.replace(m, '</span><span class="'+o+'">')
     }
     jv.lastFGColour = n[0]
     if (n[1]) { jv.lastBGColour = n[1] } else { jv.lastBGColour = null }
    }
   }
   
   // replicate jm.handleTrigger
   s = s.replace(/\x1B\[((\d*);){0,2}(\d*)m/g,'')
        .replace(/\x1B\[[\d;]+m/g, '')
        .replace(/\x1B\[dz/g, '')
        .replace(/\x1B/g, '')
        .replace(/\\u001b/g,'')
        .replace(/\\u0001/g,'')
        .replace(/\r/g,'')
        .replace(/\x01/g, '')
        .replace(/\[4z/g, '')
        /*.replace(/\<a href.+?>/g,'')
        .replace(/<\/a\>/g,'')
        .replace(/\<span .+?\>/g,'')
        .replace(/\<\/span\>/g,'')
   s = s.replace(/\x1B\[((\d*);){0,2}(\d*)m/g,'')
   s = s.replace(/\x1B\[[\d;]+m/g, '')
   s = s.replace(/\x1B/g, '')
        */

   var pkl
   if (jv.lastFGColour) { 
     pkl = '<span class="'+jv.lastFGColour
     if (jv.lastBGColour) {
       pkl += ' '+jv.lastBGColour
     }
     pkl += '">' + s 
     s = pkl
   } else { s = '<span class="normal"> '+s }
   s += '</span><br>' // <span class="'+jv.lastColour+'">'
   // Matching lines
   
   if (line.match('<PROMPT>')) { 
    s = '<span class="mutrigger">&compfn;</span> ' + s
   } else if (jv.lineMatched) { 
    s = '<span class="triggered">&compfn;</span> ' + s 
   } else { 
    s = '<span class="untrigger">&compfn;</span> ' + s }
   /**/
   jv.lineMatched = false

   // Timestamp
   var tstmp = currentTime.getTime()
   var mins  = currentTime.getMinutes()
   var secs  = currentTime.getSeconds()
   var mscs  = currentTime.getMilliseconds()
   tstmp = ju.lpad(mins,2,'0') + ':' + ju.lpad(secs,2,'0') + ':' + ju.lpad(mscs,3,'0') + ' '
   s = '<span class="timestamp mute">'+tstmp+'</span>' + s
   if (jo.timestamp) { s = s.replace('class="timestamp mute"', 'class="timestamp mute" style="font-family: Lekton"') }

   // Modifying output
   if (jv.lineModify) {
    jv.lineModify = false
    while (jt.mods.length) {
     var x = jt.mods.shift()
     s = jm.primp(s,x)
    }
   }
   
   // jm.print(s)
   jv.lastpacket = s
   
   // Safety catches
   jv.lineModify = false
   if (line.match('<PROMPT>')) { jt.mods = [] }
   jv.lines++
   jv.currentBuffer++
   
  }
  // for lastpackets
  if (jv.orphanMatch.length > 0) { } else { 
    outgoing.push(s)
  }
 }
 var nxp = new Date()
 // log(nxp - pxn)
 jm.print(outgoing.join(''))
 // manage lastpackets for wrap
 if (jv.lastpackets.length > jo.packetWrap) { jv.lastpackets.shift() }
 jv.lastpackets.push(outgoing)
}

jm.simplifyLine = function(line) {
 var s = line
     s = s.replace(/\<a href.+?>/g,'')
          .replace(/<\/a\>/g,'')
          .replace(/\<span .+?\>/g,'')
          .replace(/\<\/span\>/g,'')
          .replace(/\x1B\[((\d*);){0,2}(\d*)m/g,'')
          .replace(/\x1B\[[\d;]+m/g, '')
          .replace(/\x1B\[dz/g, '')
          .replace(/\x1B/g, '')
          .replace(/\\u001b/g,'')
          .replace(/\\u0001/g,'')
          .replace(/\r/g,'')
          .replace(/\x01/g, '')
          .replace(/\[4z/g, '')
 return s
}

jm.handleTriggers = function(line) {
  // Strip tags
  jm.raw  = line
  line    = jm.simplifyLine(line)
  if (line.match('<PROMPT>')) {
    jv.lineMatched = false; prompt(line)
  } else {
    jt.discover(line)
  }
  return line
}

jm.primp = function(s,x) {
 var s = s || ''
 if (x.fx) {
  switch (true) {
   case x.fx == 'replace':
    s = s.replace(x.pattern,x.args[0])
    break
   case x.fx == 'multireplace':
    // assuming pattern is regex
    var mm = s.match(x.regex)
    if (mm) { for (var i=0; i<mm.length; i++) {
     var m = mm[i]
         m = m.replace(x.regex, x.newpattern)
         s = s.replace(mm[i], m)
    } }
    break
   case x.fx == 'whole-sub':
    if (x.opt && x.opt.line) {
     s = x.opt.line
     s = '<span class="triggered">&compfn;</span> ' + s 
    }
    break
   case x.fx == 'jyveDelete':
    if (x.opt && x.opt.replace) {
     var regx = x.opt.regx || null
     if (typeof regx != null) { s = s.replace( regx, x.opt.replace ) } else {
     s = s.replace(x.opt.pattern,x.opt.replace) }
    } else {
     s = ''
    }
    break
   case x.fx == 'internal':
    if (x.opt && x.opt.what) {
     var regx = x.opt.regx || null
     if (typeof regx != null) { s = s.replace( regx, x.opt.so ) } else {
     s = s.replace(x.opt.what,x.opt.so) }
     // s = s.replace(x.opt.what,x.opt.so)
    }
    break
   case x.fx == 'append':
    s = s.replace('<br>', x.args[0] + '<br>')
   default:
    break
  }
 }
 return s
}

jm.elucidate = function() {
 // sigh
 jv.listenOhmap = false
 var form = 'IAC-SB-GMCP-message-!IAC-IAC-SE'
 var out = []
 var outPositions = []; var outTemp = '';
 var gmcpFlag = false
 var buf = ju.clone(jv.GABuffer)
 var ouf = []
 var puf = []
 for (var k=0;k<buf.length;k++) {
  var Char = buf[k]
  var CharNext = null;     if (buf[k+1]) { CharNext     = buf[k+1] }
  var CharNextNext = null; if (buf[k+2]) { CharNextNext = buf[k+2] }
  var CharBefore = null;   if (buf[k-1]) { CharBefore   = buf[k-1] }
  if (Char === 255 && CharNext === 250 && CharNextNext === 201) {
   gmcpFlag = true // log('IAC-SB-GMCP')
  }
  if (Char === 255 && CharNext === 240 && CharBefore != 255) {
   gmcpFlag = false // log('IAC-SE')
   jm.readGMCP(ouf)
   if (jv.ohmap.length > 0) {
    console.log(jv.ohmap)
    jv.ohmap = []
   }
   ouf = []
  }
  if (gmcpFlag) {
   var c = Char
   // if (ju.key(jv.mapping,c)) { } else {
   if (jv.mappedKeys.includes(c)) {} else {
    c = String.fromCharCode(c)
   }
   ouf.push(c)
  } else {
   if (jv.listenOhmap) { jv.ohmap.push(Char) }
   puf.push(Char)
  }
 }
 jv.GABuffer = ju.clone(puf)
}

jm.adonize = function(str) {
 var out = []
 out = str.split('-')
 out = out.map(jm.lookupUint8)
 out = [].concat.apply([], out)
 return out
}

jm.lookupUint8 = function(Char) {
 var ascii = function(a) { return a.charCodeAt(0) }
 if (jv.mapping[Char]) { return jv.mapping[Char] }
 if (parseInt(Char)) { return parseInt(Char) }
 return Char.split('').map(ascii)
}

jm.subarray = function(arr, subarr, from_index) {
 var i  = from_index >>> 0,
     sl = subarr.length,
      l = arr.length + 1 - sl;
 loop: for (; i<l; i++) {
  for (var j=0; j<sl; j++) {
   if (arr[i+j] !== subarr[j]) {
    continue loop;
    return i;
   }
  }
 }
 return -1
}

jm.contains = function(cmd) {
 if (jm.subarray(jv.GABuffer,jm.adonize(cmd))) { return true }
 return false
}

jm.readGMCP = function(arr) {
 var s = arr.join('').replace('255250201','')
 if (s == 'Core.Ping') { 
     jv.pingTime = jv.pingStart - new Date().getTime()
     jv.pingTime = jv.pingTime * -1
     if ($('#ping').length) { $('#ping').text(jv.pingTime) }
     }
 var gm = s.match(/^(.*?)\s/)
 var cp = s.match(/.*?\s(.*)/)
 var update = ''
 if (gm) { update = gm[1] }
 if (gm) { gm = gm[1] }
 if (cp) {
  cp = cp[1].trim()
  if (update == 'IRE.Display.Ohmap' && cp == 'start') {
    jv.listenOhmap = true
  } else if (update == 'IRE.Display.Ohmap' && cp == 'stop') {
    jv.listenOhmap = false
  }
  cp = JSON.parse(cp)
 }
 var stringToObject = function(str, type) {
  type = type || "object";  // can pass "function"
  var arr = str.split(".");
  var fn = gmcp; //  global
  for (var i = 0, len = arr.length; i < len; i++) {
   fn[arr[i]] = fn[arr[i]] || {}
   fn = fn[arr[i]];
  }
  if (typeof fn !== type) {
   throw new Error(type +" not found: " + str);
  }
  return fn;
 }
 if (gm && cp) {
  // empty players
  if (gm == 'Room.Players')      { gmcp.Room = gmcp.Room || {}; gmcp.Room.Players = {} }
  if (gm == 'Room.AddPlayer')    { gmcp.Room = gmcp.Room || {}; gmcp.Room.AddPlayer = {} }
  if (gm == 'Room.RemovePlayer') { gmcp.Room = gmcp.Room || {}; gmcp.Room.RemovePlayer = {} }
  gm = stringToObject(gm)
  for (var i in cp) { gm[i] = cp[i] }
   var type = s.match(/^(.*?)\s/)[1]
   if (type == 'Char.Skills.Groups') { jv.handshake = 2 } // ! negotiation complete
   // emit GMCP update
   gmcpUpdate(update)
 }
}

jv.attr = { 0:  'normal'
          , 1:  'bold'
          , 4:  'underline'
          , 30: 'black'
          , 31: 'red'
          , 32: 'green'
          , 33: 'yellow'
          , 34: 'blue'
          , 35: 'magenta'
          , 36: 'cyan'
          , 37: 'normal'
          , 40: 'black-bg'
          , 41: 'red-bg'
          , 42: 'green-bg'
          , 43: 'yellow-bg'
          , 44: 'blue-bg'
          , 45: 'magenta-bg'
          , 46: 'cyan-bg'
          , 47: 'white-bg' }

jv.mapping  = {
  IAC:   255,
  WILL:  251,
  DO:    253,
  GMCP:  201,
  TT:    24,
  SB:    250,
  SE:    240,
  GA:    249,
  ETX:   3,
  EOT:   4,
  WONT:  252,
  DONT:  254,
  ATCP:  200, }
jv.mappedKeys = [255,251,253,201,24,250,240,249,3,4,252,254,200]

  // Less important for negotiations
  // IS:    0,
  // SEND:  1,
  // CR:    13,
  // ZMP:   93, ? square bracket

/*
jReload = function() {
 var list = ju.clone(jo.userScripts)
 var started = false
 // https://stackoverflow.com/a/33464843/6881999
 list.reduce(function(p, item) {
    return p.then(function() {
        if ($('#output').length) {
         if (!started) { started = true } else { 
          $('#output').append('<span class="mute">complete.</span><br >') 
          $('#output').scrollTop(document.getElementById('output').scrollHeight) // !important
         }
        }
        return jLoad(item);
    });
 }, Promise.resolve()).then(function() {
    // all done here
    if ($('#output').length) {
     $('#output').append('<span class="mute">All done.</span><br >');
     $('#output').scrollTop(document.getElementById('output').scrollHeight) // !important
    }
 });
}
*/