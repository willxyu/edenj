// Load last in the client specification
// jprint also re-written at the bottom of this file. !important

// Handle old data
var oldcurr = null
var oldlogr = null
if (typeof logr !== 'undefined') {
 oldcurr = logr.current
 oldlogr = logr.buffer
}

logr = (function() {
 var clone  = ju.clone
 var print  = jm.print
 var alias  = ja.make
 var trigr  = jt.make
 var prefix = '<span class="seagreen">(<span class="turquoise" style="font-family:\'Fantasque\';">logr</span>)</span>'
 var limit  = 1000  // packets
 var sname  = 'log.xml'
 var output = 'output'
 var player = player || null
 
 var buffer = oldlogr || []
 var curr   = curr    || 0
 var setbuffer = function(value) { logr.buffer  = value; buffer = logr.buffer  }
 var setcurr   = function(value) { logr.current = value; curr   = logr.current }
 var setplayer = function(fx) {
  if (typeof fx === 'undefined') { log('Error assigning player to logr.'); return }
  player = fx
 }
 
 var report = function(s) {
   s = prefix + ' <span style="color: grey;">' + s + '</span><br >'
   print(s)
   $('#'+output).scrollTop(document.getElementById(output).scrollHeight) // !important
 }
 
 var add = function(packet) {
   var n = buffer.length
   if (n > limit) {
     while (buffer.length > limit) { buffer.shift() }
   }
   buffer.push(packet)
 }
 
 var state = function(time) {
  var out = {}
      out.time = time || new Date().getTime()
      out.room = {}
      if (typeof gmcp !== 'undefined' &&
          typeof gmcp.Room !== 'undefined' &&
          typeof gmcp.Room.Info !== 'undefined') {
      out.room.num  = gmcp.Room.Info.num
      out.room.area = gmcp.Room.Info.area
      out.room.name = gmcp.Room.Info.name }
  if (typeof target == 'string' && typeof player == 'function' && player(target)) {
    var v = player(target) || false
    var t = {}
        t.name = target
    if (typeof v.affs !== 'undefined') { t.affs = clone(v.affs) }
    if (typeof v.vars !== 'undefined') { t.affs = clone(v.vars) }
    out.target = t
  }
  if (typeof me !== 'undefined' && typeof me.affs !== 'undefined') {
    out.self = {}
    out.self.affs = clone(me.affs)
  }
  return out
 }
 
 var write = function() {
   var t = logr.buffer
   var tf
   var f = function(data) {
    // line, printed, state: time, room <>, self <>, target <>
    var s = ''
    for (var i=0;i<data.length;i++) {
     var n = data[i]
     s += '<aeon-packet>'
     for (var j=0;j<n.length;j++) {
       var q       = n[j]
       var raw     = q.line    || ''
       var printed = q.printed || ''
       var nt      = q.state   || {}
       var ntime   = nt.time   || 0
       var nroom   = nt.room   || {}
       var nself   = nt.self   || {}
       var ntarget = nt.target || {}
       s += '<aeon-line>'
       s +=   '<aeon-raw>'
       s +=   raw
       s +=   '</aeon-raw>'
       s +=   '<aeon-printed>'
       s +=   printed
       s +=   '</aeon-printed>'
       s +=   '<aeon-state>'
       s +=   '<aeon-time>' + ntime + '</aeon-time>'
       var nrnum   = nroom.room || '0'
       var nra     = nroom.area || 'Unknown'
       var nrname  = nroom.name || 'Unknown'
       s +=   '<aeon-room>'
       s +=    '<aeon-roomnum>' + nrnum + '</aeon-roomnum>'
       s +=    '<aeon-roomarea>' + nra + '</aeon-roomarea>'
       s +=    '<aeon-roomname>' + nrname + '</aeon-roomname>'
       s +=   '</aeon-room>'
       var nsaffs  = nself.affs || {}
       s +=   '<aeon-self>'
       s +=   '<affs>'
       for (var k in nsaffs) {
        var v = nsaffs[k]
        s +=  '<' + k + '>' + v + '</' + k + '>'
       }
       s +=   '</affs>'
       s +=   '</aeon-self>'
       var ntname  = ntarget.name || 'Undeclared'
       var ntaffs  = ntarget.affs || {}
       var ntvars  = ntarget.vars || {}
       s +=   '<aeon-target>'
       s +=   '<name>' + ntname + '</name>'
       s +=   '<affs>'
       for (var k in ntaffs) {
        s += '<' + k + '>' + ntaffs[k] + '</' + k + '>'
       }
       s +=   '</affs>'
       s +=   '<vars>'
       for (var k in ntvars) {
        s += '<' + k + '>' + ntaffs[k] + '</' + k + '>'
       }
       s +=   '</vars>'
       s +=   '</aeon-target>'
       s +=   '</aeon-state>'
       s += '</aeon-line>'
     }
     s += '</aeon-packet>'
    }
    data = s
    // data = JSON.stringify(data)
    // data = 'data='+data
    var dx = new Blob([data], { type:'text/plain' })
    tf = window.URL.createObjectURL(dx)
    return tf
   }
   var a = document.createElement('a')
       a.setAttribute('download', sname)
       a.href = f( t )
   document.body.appendChild(a)
   window.requestAnimationFrame( function() {
    var e = new MouseEvent('click')
    a.dispatchEvent(e)
    document.body.removeChild(a)
   })
   report('Writing log.')
 }
 
 alias('^log$','logr.write()')
 trigr({
   name: 'logr.assignment',
   pattern: '^Password correct\. Welcome to Achaea\.$',
   response: `logr.setplayer(dbf.player)`,
 })
 
 return {
   buffer  : buffer,
   current : curr,
   
   add       : add,
   setbuffer : setbuffer,
   setcurr   : setcurr,
   setplayer : setplayer,
   state     : state,
   write     : write,
 }
})()


logr.intercept = function(line) {
 var t = {}
     t.line    = ''
     t.printed = line
     t.state = logr.state()
 logr.add([t])
} 

// being extremely sneaking and covertly re-writing jprint, to split jm.print and (user) jprint
//   this helps to log untriggered lines such as custom output
jprint = function(line) {
 logr.intercept(line)
 jm.print(line)
}