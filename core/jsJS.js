
mm = typeof mm !== 'undefined' ? mm : {}
mm.copy = function(thing) { var out; if (null == thing || 'object' != typeof thing) return thing; if (thing instanceof Date) { out = new Date(); out.setTime(thing.getTime()); return out }; if (thing instanceof Array) { out = []; for (var i=0;i<thing.length;i++) { out[i] = mm.copy(thing[i]) }; return out }; if (thing instanceof Object) { out = {}; for (var attr in thing) { if (out.hasOwnProperty(attr)) { out[attr] = mm.copy(thing[attr]) } }; return out }; throw new Error('Unable to copy thing! Type not supported.'); }
mm.load = function(url) { var s = $('<script>', {'type':'text/javascript','src':url,})[0]; document.getElementsByTagName('head')[0].appendChild(s); }
mm.rpad = function(str,len,char) { if (typeof str =='number') { str = str.toString() }; if (char == null) { char = ' ' }; var r = len - str.length; if (r < 0) { r = 0 }; return str + char.repeat(r); }

mm.list = [
 // CORE
 './core/jsU.js',          
 './core/jsCSS.js',         // css script
 './core/jsGithub.js',      // !important
 './core/jsMaster.js',      // !important
 './core/jsConnect.js',     // !important
 './core/jsReceiver.js',    // !important
 './core/jsTrigger.js',     // !important
 // CORE-2
 './core/jsAutotriggers.js', 
 './core/jsKeypressbinding.js',
 './core/jsPrompt.js',
 './core/jsGMCP.js',
 './core/jsScrollback.js',
 // CORE-3
]
mm.v_ip = false       // reload in process
mm.v_no  = 0          // loaded count
mm.v_tp  = []         // iterative list
mm.v_dt  = new Date() // performance tracking

reload = function(verbose) {
  var head = document.getElementsByTagName('head')[0]
  var copy = mm.copy
  var rpad = mm.rpad
  var list = mm.list
  var jout = $('#output')
  var joul = jout.length

  if (!mm.v_ip) { 
    mm.v_ip = true
    var sc = head.getElementsByTagName('script')
    var cs = head.getElementsByTagName('link')
    var i = sc.length; while (i--) { sc[i].parentNode.removeChild(sc[i]) }
    var i = cs.length; while (i--) { cs[i].parentNode.removeChild(cs[i]) }
    head.appendChild($('<link>',{'rel':'icon','type':'image/png','href':'./core/resources/icon.png' })[0])
  }
  if (mm.v_tp.length == 0) { 
    mm.v_tp = copy(list)
    mm.v_dt = new Date()
    if (joul) { jout.append('<span class="mute">Loading client dependencies ') }
  }
  if (mm.v_no >= mm.v_tp.length) {
    mm.v_ip = false
    var t = new Date() - mm.v_dt
    if (joul) { jout.append('<span class="mute"> complete. ( <span class="link">'+t+'</span>ms)</span><br >') }
    mm.v_no = 0
    mm.v_tp = []
    if (jReload) { jReload() }
    return 
  }
  var addr = mm.v_tp[mm.v_no]
  var elem = document.createElement('script')
      elem.src = addr
      elem.onload = reload_CB
  head.appendChild(elem)
  if (verbose) {
   if (joul) { jout.append('<br ><span class="mute">Loading core <i>j</i> <span class="normal">'+rpad(addr,29)+'</span></span>') }
  } else {
   if (joul) { jout.append('<span class="normal">.') }
  }
  if (joul) { jout.scrollTop( document.getElementById('output').scrollHeight ) } // !important
  function reload_CB() {
    if (verbose && joul) { jout.append('<span class="mute"> success.</span>') }
    mm.v_no++
    reload(verbose)
  }
}
reload()
