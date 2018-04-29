/*
  Jyve Triggers
   
  requires
   jv
    .lineMatched
    .lineModify

  uses:

  index:
   def jt
   jt
    .discover        runs triggers
    .make
    .batch
   highlight
   sub
   tagOn
 */

matches = typeof matches !== 'undefined' ? matches : []

jt       = typeof jt       !== 'undefined' ? jt       : {}
jt.mods  = typeof jt.mods  !== 'undefined' ? jt.mods  : []
jt.trigs = [] // re-make each time this file is loaded
jt.ign   = typeof jt.ign   !== 'undefined' ? jt.ign   : false

jt.discover = function(line) {
 var tr = jt.trigs
 var out = undefined
 for (var i=0;i<tr.length;i++) {
  var t = tr[i]
  if (t.RE && t.RE.exec(line)) { // If your RE is not pre-formed, writing them on each loop is expensive
   if (jv.lineMatched == false) {
    if (jt.ign) { jt.ign = false } else { jv.lineMatched = true }
   }
   matches = t.RE.exec(line)
   try { out = eval(t.response) } catch(err) { log(err.message) }
  }
 }
}

jt.make = function(t) {
 if (t.pattern) { t.RE = new RegExp(t.pattern) }
 jt.trigs.push(t)
}

jt.batch = function(list) {
 for (var i=0;i<list.length;i++) {
  var m = list[i]
  for (var j=0;j<m.patterns.length;j++) {
   var t = {}
   t.name = m.name
   t.pattern = m.patterns[j]
   t.response = m.code
   jt.make(t)
  }
 }
}

jt.eval = function(str) {
 var out = []
 var temp = str.split('+trigger')
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

// Keep alive trigger
jt.make({
 name: 'TIMEOUT',
 pattern: '^You will TIMEOUT in 1 minute unless you do something\.$',
 response: 'jsend("qw")',
})
jt.make({
 name: 'http.link',
 pattern:'^[\\S\\s]*([Hh]ttps?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)?)[\\S\\s]*$',
 response: `
  var url = matches[1]
  sub({fx: 'internal', what: url, so: '<a href="'+url+'" target="_blank">'+url+'</a>'})
 `,
})

// UI functions
highlight = function(name, color, multi) {
 jv.lineModify = true
 var newSpan = '<span style="color: '+color+';">'
 var endSpan = '</span>'
 jt.mods.push({ pattern: name, fx: 'replace', args: [newSpan + name + endSpan] })
}

multisub = function(phrase, newpattern) {
 jv.lineModify = true
 var RE = new RegExp(phrase,'g')
 jt.mods.push({ fx: 'multireplace', regex: RE, newpattern: newpattern })
}

sub = function(opt) {
 jv.lineModify = true
 var opt = opt || {}
 if (opt.fx == 'whole-sub') {
  jt.mods.push({ fx: 'whole-sub', opt: opt }) 
 } else if (opt.fx == 'internal') {
  jt.mods.push({ fx: 'internal', opt: opt})
 } else {
  // no options, default delete
  jt.mods.push({ fx: 'jyveDelete', opt: opt }) }
}

tagOn = function(s) {
 jv.lineModify = true
 jt.mods.push({ fx: 'append', args: [s] })
}