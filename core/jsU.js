
ju = (function() {
 // Access global definitions
 var dropm  = function() {
   $('#output').scrollTop(document.getElementById('output').scrollHeight) }
 var print  = function(str) {
   jprint(str) }
 var receive = function(a) {
   jm.receive(a) }

 // Local definitions to be exported
 var clean = function(n) {
   if (typeof n !== 'string') { return n }
   var x = Number(n.replace(/[^-\d\.]/g,''))
   return x }

 var clone = function(obj) {
   var copy
   if (null == obj || 'object' != typeof obj) { return obj }
   if (obj instanceof Date) { 
    copy = new Date()
    copy.setTime(obj.getTime())
    return copy }
   if (obj instanceof Array) {
    copy = []
    for (var i=0; i<obj.length; i++) {
      copy[i] = clone(obj[i]) }
    return copy }
   if (obj instanceof Object) {
    copy = {}
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
       copy[attr] = clone(obj[attr]) } }
    return copy }
   throw new Error('Unable to copy obj! Type not supported.') }

 /* https://stackoverflow.com/a/2901298 */
 var comma = function(x) {
   var parts = x.toString().split('.')
   parts[0]  = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,',')
   return parts.join('.') } 

 var display = function(a) {
   var r = function(k,v) {
    if (typeof v === 'function') {
      var q = '' + v
          q = q.substring(0, 79)
      return 'FUNCTION >>   ' + q }
    return v }
   var x = JSON.stringify(a, r, 3)
   print('<span class="normal">' + x + '</span><br>')
   dropm() }

 var interval = function(a,b) {
   if (!a) { return 0 }
   var a = a
   var b = b || new Date()
   if (b > a) { b = [a, a = b][0] } // swap variable contents
   var diff  = a.getTime() - b.getTime()
   var msecs = diff % 1000
   var secs  = Math.floor(diff / 1000)
   var mins  = Math.floor(secs / 60)
       secs  = secs % 60
   var hrs   = Math.floor(mins / 60)
       mins  = mins % 60
   var days  = Math.floor(hrs  / 24)
        hrs  =  hrs % 24
   var s = {}
       s.msecs = msecs
       s.secs  = secs
       s.mins  = mins
       s.hrs   = hrs
       s.days  = days
   return s }

 var key = function(arr, v) {
   for (var prop in arr) {
    if (arr.hasOwnProperty(prop)) {
      if (arr[prop] === v) {
       return prop } } } }

 var lpad = function(str, len, ch) {
   if (typeof str == 'number') { str = str.toString() }
   if (ch == null) { ch = ' ' }
   var r = len - str.length
   if (r < 0) { r = 0 }
   return ch.repeat(r) + str }

 var pecho = function(str) {
   var t = str.split(/\+n/g)
   for (var k in t) {
    var v = t[k]
        v = v + '\n'
    var a = v.split('')
    for (var i=0; i<a.length; i++) {
      a[i] = a[i].charCodeAt(0) }
    a.push(255)
    a.push(249)
    var f  = []
    f.data = a
    receive(f) }
   prompt() }

 var round = function(num, dec) {
   var mult = 10 ^ (dec || 0) 
   return Math.floor(num * mult + 0.5) / mult }

 var round2 = function(num, scale) {
   if (!('' + num).includes('e')) {
    return + (Math.round(num + 'e+' + scale) + 'e-' + scale)
   } else {
    var arr = ('' + num).split('e')
    var sig = ''
    if (+arr[1] + scale > 0) { sig = '+' }
    return + (Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) + 'e-' + scale) } }

 var rpad = function(str, len, ch) {
   if (typeof str == 'number') { str = str.toString() }
   if (ch == null) { ch = ' ' }
   var r = len - str.length
   if (r < 0) { r = 0 }
   return str + ch.repeat(r) }

 // https://stackoverflow.com/a/1584377
 var uniarray = function(arr) {
   var a = arr.concat()
   for (var i=0; i<a.length; ++i) {
    for (var j=i+1; j<a.length; ++j) {
      if (a[i] === a[j]) {
       a.splice(j--, 1) } } }
   return a }

 var uuid = function() {
   var d = new Date().getTime()
   if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now() }
   var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(v) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (v == 'x' ? r : ( r&0x3|0x8)).toString(16) })
   return uid }

 return {
  clean    :  clean,
  clone    :  clone,
  commaThis:  comma,
  display  :  display,
  interval :  interval,
  key      :  key,
  lpad     :  lpad,
  pecho    :  pecho,
  round    :  round,
  round2   :  round2,
  rpad     :  rpad,
  uniqueA  :  uniarray,
  uuid     :  uuid,
 }
})()

clone       = ju.clone
// dateSep     = ju.interval
display     = ju.display
echoCommand = ju.pecho
jround      = ju.round2
uniqueArray = ju.uniqueA
// uuid        = ju.uuid

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}