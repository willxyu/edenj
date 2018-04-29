mapdb = typeof mapdb !== 'undefined' ? mapdb : {}

mapdb.map = mapdb.map || {}

mapdb.host  = 'achaea'
mapdb.page  =  20
mapdb.xmls  = '/get_map_xml.php'
mapdb.addr  =  mapdb.host + '.com'
mapdb.prtc  = 'https'

mapdb.init = function() {
 $.get( mapdb.xmls, { url: mapdb.addr, protocol: mapdb.prtc, area: 'areas' }, mapdb.parse)
}

mapdb.clone = ju.clone

mapdb.parse = function(data) {
 var xml
 var out = []
 var start = new Date().getTime()
 try {
   // xml = JSON.parse(data), would that this worked simply
   // bit of a hack!
       out = data.split('<environments>')
   var env = out[1]
       out = out[0]
       out = out.split('<rooms>')
   var rms = out[1]
   var ars = out[0]
       ars = ars.split('<areas>')
       ars = ars[1]

   // processing
   ars = ars.split('\n')
   ars.pop()
   ars.pop()
   ars.shift()
   
   rms = rms.replace('</rooms>\n','')
   rms = rms.split('\n')

   env = env.replace('</map>\n','')
   env = env.replace('</environments>\n','')
   env = env.split('\n')
   env.pop()
   env.pop()
   env.shift()

   out = {}
   out.areas = mapdb.parseAreas(ars)
   out.rooms = mapdb.parseRooms(rms)
   out.envs  = mapdb.parseEnvs(env)

   out.composite = mapdb.composite(out)
   mapdb.map = out
   // log(mapdb.map) // debugging
   var stop = new Date().getTime()
   var diff = Math.floor(stop - start)
   log('Performance[:] ' + Math.floor((stop - start)) + ' ms')
   jprint('(map): Map loading done in ' + diff + ' ms!<br>')

      start = new Date().getTime()
   // generate the hash for rooms and areas
   mapdb.map.hashrooms = mapdb.hash()
   mapdb.map.hashareas = mapdb.areahash()
       stop = new Date().getTime()
       diff = Math.floor(stop - start)
   jprint('(map): Hash calculated for areas and rooms in ' + diff + ' ms.<br>')

 } catch (err) {
   log(err)
   jprint('(map): ' + err)
 }
}

mapdb.parseEnvs = function(env) {
 var idRegex   = new RegExp(/id="\d+"/)
 var nameRegex = new RegExp(/name=".*?"/)
 var clRegex   = new RegExp(/color="\d+"/)
 var hclRegex  = new RegExp(/htmlcolor=".*?"/)
 var out = []
 for (var i=0; i<env.length; i++) {
   var t = {}
   var m = idRegex.exec(env[i])
       m = m[0]
       m = m.replace('id=','')
       m = m.replace('"','')
       m = parseInt(m)
   var n = nameRegex.exec(env[i])
       n = n[0]
       n = n.replace(/"$/,'')
       n = n.replace('name="','')
   var o = clRegex.exec(env[i])
       o = o[0]
       o = o.replace('color=','')
       o = o.replace('"','')
       o = parseInt(o)
   var p = hclRegex.exec(env[i])
       p = p[0]
       p = p.replace('htmlcolor=','')
       p = p.replace('"','')
       p = parseInt(p)
   t.id = m
   t.name = n
   t.color = o
   t.htmlc = p
   out.push(t)
 }
 return out
}

mapdb.composite = function(arr) {
 var out = {}
 var a = arr.areas
 for (var i=0; i<a.length; i++) {
  var key = String(a[i].id)
  out[key] = {}
  out[key].name = a[i].name
  out[key].adjs = []
 }
 out.Unspecified = {}
 var r = arr.rooms
 for (var k in r) {
   var a = r[k].area || 'Unspecified'
       a = String(a)
   var v = String(r[k].id)
   var e = mapdb.queryAreaChange(r[k]) // compile area exits this room for its area meta
   if (out[a]) {
     out[a][v] = mapdb.clone(r[k])
     // merge area exits
     var es = out[a].adjs || []
     out[a].adjs = uniqueArray(es.concat(e))
   } else {
    out.Unspecified[v] = mapdb.clone(r[k])
   }
 }
 return out
}

mapdb.queryAreaChange = function(thisroom) {
 var out = []
 var e = thisroom.exits
 for (var k in e) {
  if (e[k].tgarea != 0) {
    out.push(e[k].tgarea)
  }
 }
 return out
}

mapdb.parseRooms = function(rms) {
 var idRegex     = new RegExp(/id="\d+"/)
 var areaRegex   = new RegExp(/area="\d+"/)
 var titleRegex  = new RegExp(/title=".*?"/)
 var envRegex    = new RegExp(/environment="\d+"/)
 var xRegex      = new RegExp(/x="(?:-)*\d+"/)
 var yRegex      = new RegExp(/y="(?:-)*\d+"/)
 var zRegex      = new RegExp(/z="(?:-)*\d+"/)
 var dirRegex    = new RegExp(/direction=".*?"/)
 var tarRegex    = new RegExp(/target="\d+"/)
 var doorRegex   = new RegExp(/door="\d+"/)
 var tgareaRegex = new RegExp(/tgarea="\d+"/)
 var hiddenRegex = new RegExp(/hidden="\d+"/)
 var out = {}
 var r   = {}
     // r.exits = []
     r.exits = {}
 for (var i=0; i<rms.length; i++) {
  var str = rms[i]
      str = str.trim()
  // first line
  if (str.match('room id')) {
   var m = idRegex.exec(str)
       m = m[0]
       m = m.replace('id=','')
       m = m.replace('"','')
       m = parseInt(m)
   var n = areaRegex.exec(str)
       n = n[0]
       n = n.replace('area=','')
       n = n.replace('"','')
       n = parseInt(n)
   var o = titleRegex.exec(str)
       o = o[0]
       o = o.replace(/"$/,'')
       o = o.replace('title="','')
   var p = envRegex.exec(str)
       p = p[0]
       p = p.replace('environment=','')
       p = p.replace('"','')
       p = parseInt(p)
    r.id    = m
    r.area  = n
    r.title = o
    r.env   = p
  }
  // second line
  if (str.match('coord x')) {
   var m = xRegex.exec(str)
   if (m) { m = m[0]; m = m.replace('x=',''); m = m.replace('"',''); m = parseInt(m) } else {
    m = 0
   }
   var n = yRegex.exec(str)
   if (n) { n = n[0]; n = n.replace('y=',''); n = n.replace('"',''); n = parseInt(n) } else {
    n = 0
   }
   var o = zRegex.exec(str)
   if (o) { o = o[0]; o = o.replace('z=',''); o = o.replace('"',''); o = parseInt(o) } else {
    o = 0
   }
    r.x = m
    r.y = n
    r.z = o
  }

  // exits
  if (str.match('exit direction')) {
   var m = dirRegex.exec(str)
       m = m[0]
       m = m.replace(/"$/,'')
       m = m.replace('direction="','')
   var n = tarRegex.exec(str)
       n = n[0]
       n = n.replace('target=','')
       n = n.replace('"','')
       n = parseInt(n)
   var o = doorRegex.exec(str)
   if (o) { o = o[0]; o = o.replace('door=',''); o = o.replace('"',''); o = parseInt(o) } else {
    o = 0
   }
   var p = tgareaRegex.exec(str)
   if (p) { p = p[0]; p = p.replace('tgarea=',''); p = p.replace('"',''); p = parseInt(p) } else {
    p = 0
   }
   var q = hiddenRegex.exec(str)
   if (q) { q = q[0]; q = q.replace('hidden=',''); q = q.replace('"',''); q = parseInt(q) } else {
    q = 0
   }
   // r.exits.push({dir: m, target: n, door : o, tgarea : p})
   // against better instinct!
   r.exits[m] = {dir: m, target: n, door: o, tgarea: p}
  }

  // last line
  if (str == '</room>') {
   // push it out
   var n = String(r.id)
   out[n] = mapdb.clone(r)
   r = {}
   r.exits = {}
  }
 }

 return out
}

mapdb.parseAreas = function(ars) {
 var idRegex = new RegExp(/id="\d+"/)
 var nameRegex = new RegExp(/name=".*?"/)
 var out = []
 for (var i=0; i<ars.length; i++) {
   if (ars[i] == '') {} else {
   var t = {}
   var m = idRegex.exec(ars[i])
       m = m[0]
       m = m.replace('id=','')
       m = m.replace('"','')
       m = parseInt(m)
   var n = nameRegex.exec(ars[i])
       n = n[0]
       n = n.replace(/"$/,'')
       n = n.replace('name="','')
   t.id = m
   t.name = n
   out.push(t) }
 }
 return out
}

mapdb.hash = function() {
 var t = {}
 for (var k in mapdb.map.rooms) {
   var p = mapdb.map.rooms[k].exits
   var o = {}
   for (var j in p) {
    o[p[j].target] = 1
   }
   t[k] = o
 }
 return t
}

mapdb.areahash = function() {
 var t = {}
 for (var k in mapdb.map.composite) {
   var p = mapdb.map.composite[k].adjs
   var o = {}
   for (var j in p) {
    o[p[j]] = 1
   }
   t[k] = o
 }
  return t
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
      var reader = new FileReader()
      reader.onload = (function(mapfile) {
        return function(e) {
          var u = e.target.result
          // parse xml
          jprint('(map): Starting map loading...<br>')
          mapdb.parse(u)
        }
      })(f)
      reader.readAsText(f)
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);

// API
mapdb.find = function(phrase) {
 var str  = '\n'
 var then = new Date().getTime()
 var phr  = new RegExp(phrase,'gi')
 var total = 0
 var hits  = 0
 for (var k in mapdb.map.rooms) {
   total += 1
   var v = mapdb.map.rooms[k]
   var s = v.title
   if (s.match(phr)) {
    hits += 1
    str += '[' + v.id + '] '
    str += s
    str += '\n'
   }
 }
 var now = new Date().getTime()
 str += 'Search time: ' + (now - then) + ' ms finding ' + hits + ' in ' + total + ' rooms.\n'
 jprint(str)
 $('#output').scrollTop(document.getElementById('output').scrollHeight) // !important
}

mapdb.areaf = function(phrase) {
 var str  = '\n'
 var then = new Date().getTime()
 var phr  = new RegExp(phrase, 'gi')
 var total = 0
 var hits  = 0
 for (var k in mapdb.map.areas) {
   total += 1
   var v = mapdb.map.areas[k]
   var i = v.id
   var n = v.name
   if (n.match(phr)) {
    hits += 1
    str += '[' + i + '] '
    str += n
    str += '\n'
   }
 }
 var now = new Date().getTime()
 str += 'Search time: ' + (now - then) + ' ms finding ' + hits + ' in ' + total + ' areas.\n'
 jprint(str)
 $('#output').scrollTop(document.getElementById('output').scrollHeight) // !important
}

mapdb.rlist = function(num) {
 var str  = '\n'
 var then = new Date().getTime()
 var total = 0
 var hits  = 0
 for (var k in mapdb.map.rooms) {
   total += 1
   var v = mapdb.map.rooms[k]
   var s = v.title
   var a = v.area
   if (a == num) {
    hits += 1
    str += '[' + v.id + '] '
    str += s
    str += '\n'
   }
 }
 var now = new Date().getTime()
 str += 'Search time: ' + (now - then) + ' ms finding ' + hits + ' in ' + total + ' rooms.\n'
 jprint(str)
 $('#output').scrollTop(document.getElementById('output').scrollHeight) // !important
}

ja.make('^rf[ ]+(.*)$',`
 mapdb.find(matches[1])
`)

ja.make('^af[ ]+(.*)$',`
 mapdb.areaf(matches[1])
`)

ja.make('^rl[ ]+(.*)$',`
 mapdb.rlist(matches[1])
`)