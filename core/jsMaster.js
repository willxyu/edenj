/*
  Jyve Master
   handles drawing, ready-state, client printing and sending
   
  requires
   console.log => log
   qAlias
   ju
    .clean, .clone
   reload
   $

  uses:
   window, document, Uint8Array
   w
   #addenda, #input, #output, #panel
   .logo
   css
    echo

  index:
   def jm
   def jv
   def jo
   jm
    .draw            prepares webpage elements
    .ready           basic user interaction handling, Click & ENTER
    .logo            logo handling
    .print           client print handler
    .input           input handler
    .Uint8           for Receiver
   def jLoad         loads userscripts
   def jReload       loads list of userscripts
   def jsend         as shorthand jm.send
   def jprint        as shorthand jm.print
 */

jm = typeof jm !== 'undefined' ? jm : {}

/* Client Variables */
jv = typeof jv !== 'undefined' ? jv : {}
jv.user             = ''
jv.connectRequest   = new RegExp('^\-c$')
jv.connectSpecified = new RegExp('^-c .*$')
jv.reloadAll        = new RegExp('^-ra$')
jv.reloadSignal     = new RegExp('^-r$')
jv.usrReload        = new RegExp('^-ru$')
jv.connectGithub    = new RegExp('^\-g$')
jv.connected        = typeof jv.connected        !== 'undefined' ? jv.connected        : false
jv.lines            = typeof jv.lines            !== 'undefined' ? jv.lines            : 0
jv.packets          = typeof jv.packets          !== 'undefined' ? jv.packets          : 0
jv.reloaderCount    = typeof jv.reloaderCount    !== 'undefined' ? jv.reloaderCount    : 0
jv.reloaderList     = typeof jv.reloaderList     !== 'undefined' ? jv.reloaderList     : []
jv.reloaderTime     = typeof jv.reloaderTime     !== 'undefined' ? jv.reloaderTime     : ''
jv.scrollback       = typeof jv.scrollback       !== 'undefined' ? jv.scrollback       : false
jv.scrollbackOffset = typeof jv.scrollbackOffset !== 'undefined' ? jv.scrollbackOffset : 60
jv.sessionTime      = typeof jv.sessionTime      !== 'undefined' ? jv.sessionTime      : null
jv.wrapPage         = typeof jv.wrapPage         !== 'undefined' ? jv.wrapPage         : false
jv.wrapPre          = typeof jv.wrapPre          !== 'undefined' ? jv.wrapPre          : ''
jv.wrapSeq          = typeof jv.wrapSeq          !== 'undefined' ? jv.wrapSeq          : 1

_t = typeof _t !== 'undefined' ? _t : {}

/* Client Options */
jo = typeof jo !== 'undefined' ? jo : {}
jo.address     = 'achaea.com/socket/'
jo.echoInput   = false
jo.main        = 'eden.j'
jo.outputLim   = 1200
jo.packetWrap  = 4
jo.portraitMax = true
jo.portraitURL = './core/resources/bg_dragonAscend.jpg'
jo.timestamp   = true
jo.title       = 'user' // session-time
jo.wrapLim     = 3
jo.userScripts = [
  './user/modules.js',
]

ja = typeof ja !== 'undefined' ? ja : {}
ja.als  = [] // reinstantiated each reload

// ! important
jm.scripts = function(s) {
 var out = []
 var t = s.split('+script')
 t.shift()
 for (var i=0;i<t.length;i++) {
  var n = t[i]
  n = n.replace('-script','')
  try {
   out = eval(n)
  }
  catch(err) {
   log(err)
   out = 'Error: incomplete load.'
   $('#output').append('<span class="darkred"> error</span>')
  }
 }
 return out
}

jm.init = function() {
 var d = ''
 d = '<div id="performance"></div>'
 $('#panel').append(d)
 d = '<div id="ping"></div>'
 $('#panel').append(d)
}

jm.draw = function() {
 var fh = parseFloat(window.getComputedStyle(document.getElementById('input'), null).getPropertyValue('font-size'))
 $('#input').css('height', fh + 2)
 $('#output').css('height', window.innerHeight - $('#input').height() - 5)
 // $('#panel').css('bottom', fh + 4)
}

jm.ready = function() {
 var input = $('#input')
 input.focus()
 /* handle non-select mouse events */
 $(document).on( 'click', function(e) {
  if (window.getSelection && window.getSelection().toString().length > 0) { } else {
   $('#input').focus() }
 })
 
 /* handle ENTER keypress */
 $(document).keypress( function(e) {
  if (e.which == 13) {
   e.preventDefault()
   input.select()
   jm.input(input.val()) }
 })
}

jm.logo = function() {
 var d = $('.logo')
 var u = jv.user || ''
 d.fadeOut( function() { $(this).text(u) }).fadeIn()
}

jm.print = function(line) {
 if (jv.scrollback) { $('#addenda').append(line) }
 $('#output').append(line)
}

jm.input = function(data) {
 switch (true) {
  case jv.connectRequest.test(data):
    jm.connect()
    break
  case jv.connectSpecified.test(data):
    log(data)
    break
  case jv.reloadAll.test(data):
    reload()
    // jReload()
    break
  case jv.reloadSignal.test(data):
    reload()
    break
  case jv.usrReload.test(data):
    jReload()
    break
  case jv.connectGithub.test(data):
    if (jm.git) {
     var url = jm.git.basic
     window.location.href = url
    }
    break
  default:
    if (jo.echoInput) { jm.print('<span class="echo">'+data+'</span><br>') }
    jm.parcel(data)
    break
 }
}

jm.parcel = function(input) {
 var x = ja.process(input)
 if (!x) { jm.send(input) }
}

jm.send = function(input) {
 input += '\r\n'
 var a = input.split('')
 for (var i=0;i<a.length;i++) {
  a[i] = a[i].charCodeAt(0)
 }
 a = new Uint8Array(a)
 jv.pingStart = new Date().getTime() // ! dirty hack
 w.send(a)
}

jm.Uint8 = function(m) {
 var a = new Uint8Array(m)
 w.send(a)
}

jLoad = function(url, notify) {
 var notify = notify || true
 var now = new Date()
 var utc = now.getTime() 
 var s = ''
 s += '<span class="black">' + utc + '</span> '
 s += '<span class="mute">Loading <span class="normal"><i>' + url + '</i></span> ... </span>'
 if ($('#output').length) { $('#output').append(s)
    $('#output').scrollTop(document.getElementById('output').scrollHeight) }
 
 var s = $('<script>', {
  'type'  :  'text/javascript',
  'src'   :  url,
 })[0];
 document
  .getElementsByTagName('head')[0]
  .appendChild(s);
}

jReload = function() { // https://stackoverflow.com/a/44137377/6881999
  var JQOUTPUT_ = $('#output')
  if (jv.reloaderList.length == 0) { 
         jv.reloaderTime = new Date()
         jv.reloaderList = ju.clone(jo.userScripts) }
  if (jv.reloaderCount >= jv.reloaderList.length) { 
         jv.reloaderCount = 0
         jv.reloaderList = []
         return
         }
  var addr = jv.reloaderList[jv.reloaderCount]
  var jsel = document.createElement('script')
  jsel.src = addr
  jsel.onload = jreloadCB
  // if (document.body.contains(jsel)) { document.getElementsByTagName('head')[0].removeChild(jsel) }
  document.getElementsByTagName('head')[0].appendChild(jsel)
  JQOUTPUT_.append('<span class="mute"> > Loading <span class="normal"><i>'+ju.rpad(addr,30)+'</i></span>')
  function jreloadCB() {
    JQOUTPUT_.append('<span class="mute"> success.</span>')
    jv.reloaderCount++
    if (jv.reloaderCount >= jv.reloaderList.length) { 
      var now = new Date()
      var t = now - jv.reloaderTime
      JQOUTPUT_.append('<span class="mute"> ( <span class="link">'+t+'</span>ms)</span><br >')
      JQOUTPUT_.scrollTop(document.getElementById('output').scrollHeight) // !important
      // Important!
      if (typeof GithubSystemReady == 'function') { GithubSystemReady() }
      if (typeof LocalSystemReady  == 'function') { LocalSystemReady()  }
    }
    JQOUTPUT_.append('<br >')
    jReload()
  }
}
// jReload = jReload2

jm.timestampOn = function() {
  $('.timestamp').css('font-family','"Lekton"')
  if ($('#output').length) {
   $('#output').scrollTop(document.getElementById('output').scrollHeight) }
}

jm.timestampOff = function() {
  $('.timestamp').css('font-family','"AdobeBlank"')
  $('.timestamp').css('font-size','3pt')
  $('.timestamp').css('line-height','5px')
  $('.timestamp').css('white-space','pre-wrap')
  if ($('#output').length) {
   $('#output').scrollTop(document.getElementById('output').scrollHeight) }
}

jm.evalscript = function(s) { // !important
 var out = []
 var temp = s.split('+script')
 temp.shift()
 for (var i=0;i<temp.length;i++) {
   var t = temp[i]
   t = t.replace('-script','')
   try { eval(t) } catch(err) { log(err) }
 }
}

ja.process = function(s) {
 var bool = false
 for (var i=0;i<ja.als.length;i++) {
   var RE = ja.als[i].RE || {}
   if (RE.exec && RE.exec(s)) {
    bool = true
    matches = RE.exec(s)
    try { eval(ja.als[i].output) } catch(err) { log(err) }
   }
 }
 return bool
}
ja.make = function(pattern,output) {
 var RE = new RegExp(pattern)
 ja.als.push({ pattern: pattern, output: output, RE: RE })
}
ja.batch = function(list) {
 for (var i=0;i<list.length;i++) {
  var m = list[i]
  for (var j=0;j<m.patterns.length;j++) {
   var t = {}
   t.name = m.name
   t.pattern = m.patterns[j]
   t.response = m.code
   ja.make(t.pattern,t.response,t.name)
  }
 }
}
ja.eval = function(str) {
 var out = []
 var temp = str.split('+alias')
 temp.shift()
 for (var i=0;i<temp.length;i++) {
  var name = ''
  var patterns = []
  var code = ''
  var codeM = temp[i].match(/\+do[\s\S]*?\-en/gim)
  if (codeM) { for (var j=0;j<codeM.length;j++) {
    code = codeM[j].replace('+do','').replace('-en','') } }
  var nameM = temp[i].match(/\+n[\s\S]*?\r?\n/g)
  if (nameM) { for (var j=0;j<nameM.length;j++) {
    name = nameM[j].replace('+n ','').replace('\n','') } }
  var pattM = temp[i].match(/\+p[\s\S]*?\r?\n/g)
  if (pattM) { for (var j=0;j<pattM.length;j++) {
    patterns.push(pattM[j].replace('\n','').replace('+p ','')) } }
  out.push({ name: name, patterns: patterns, code: code })
 }
 return out
}

jsend  = jm.send       // shorthand for non-core & users
jprint = jm.print      // shorthand for non-core & users
jaka   = ja.make       // shorthand for non-core & users
jscrip = jm.evalscript // shorthand for non-core & users

jaka('^`js[ ]+(.*)$', `
  var s = matches[1]
  var sx = s
  try {
   sx = eval(s)
  } catch(err) {
   log(err)
  }
  display(sx)
  log(eval(matches[1]))
`)