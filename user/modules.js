
mods = typeof mods !== 'undefined' ? mods : {}

mods.alias = jaka
mods.print = jprint
mods.copy  = ju.clone
mods.jscr  = jm.scripts
mods.jt    = jt.batch
mods.jtev  = jt.eval
mods.ja    = ja.batch
mods.jaev  = ja.eval

mods.prefix = '<span class="seagreen">(<span class="turquoise">mods</span>)</span>'
mods.list = [
 'core',
 'ui',
 /*
  */
]
mods.reg  = mods.reg || {}

mods.register = function(name, data) {
 var copy = mods.copy
 // Make the hard copy
 mods.reg[name] = {}
 mods.reg[name].scripts = copy(data.scripts)
 mods.reg[name].triggers= copy(data.triggers)
 mods.reg[name].aliases = copy(data.aliases)
 
 var t = mods.reg[name]
 // expand scripts, triggers, aliases
 mods.expand(t)
 
 // Load secondary files, name.secondary.js
 if (data.secondaries) {
  var n = data.secondaries.split('\n')
  for (var k in n) {
    if (n[k].length != 0) {
     var s = n[k].trim()
     mods.load('./user/'+name+'/'+name+'.'+s+'.js')
    }
  }
 }
 // mods.report(' Loaded <span class="violent">'+name+'</span> complete.')
}

mods.append = function(name, data) {
 var copy = mods.copy
 if (mods.reg[name]) {
  var scripts = copy(data.scripts)
  var triggers = copy(data.triggers)
  var aliases = copy(data.aliases)
  if (scripts)  { mods.reg[name].scripts += scripts }
  if (triggers) { mods.reg[name].triggers += triggers }
  if (aliases)  { mods.reg[name].aliases += aliases }
 }
 mods.expand(data)
}

mods.expand = function(t) {
 mods.jscr(t.scripts)             // jm.scripts(t.scripts)
 mods.jt( mods.jtev(t.triggers) ) // jt.batch(jt.eval(t.triggers))
 mods.ja( mods.jaev(t.aliases) )  // ja.batch(ja.eval(t.aliases))
}

mods.load = function(url) {
 var s = $('<script>', {
   'type'  :  'text/javascript',
   'src'   :  url,
 })[0];
 document
   .getElementsByTagName('head')[0]
   .appendChild(s);
}

mods.loadcs = function(url) {
 var css = $('<link>', {
   'rel'   :  'stylesheet',
   'type'  :  'text/css',
   'href'  :  url,
 })[0];
 document
   .getElementsByTagName('head')[0]
   .appendChild(css);
}

mods.report = function(s) {
 s = mods.prefix + s + '<br >'
 mods.print(s)
 $('#output').scrollTop(document.getElementById('output').scrollHeight) // !important
}

mods.initialise = function() {
 var copy = mods.copy
 var mk   = copy(mods.list)
 for (var i=0;i<mk.length;i++) {
   var module = mk[i]
   mods.load('./user/'+module+'/'+module+'.main.js')
   mods.loadcs('./user/'+module+'/'+module+'.main.css')
 }
}

mods.initialise()

mods.alias('^mods$',`
 var s = ''
 s += ' <span class="sysecho">Registered modules: '
 for (var k in mods.reg) {
  s += '<span class="violent">' + k + '</span>, '
 }
 s = s.replace(/,\\s*$/, '')
 s += '</span>'
 mods.report(s)
`)