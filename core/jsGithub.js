

jm = typeof jm !== 'undefined' ? jm : {}

jm.git       = jm.git       || {}

jm.git.token = jm.git.token || ''
jm.git.gists = jm.git.gists || []

jm.git.check = function() {

}

jm.git.draw_login = function() {

}

jm.git.assignToken = function(token) {
 jm.git.token = token
}

jm.git.assignList = function(list) {
 var copy = ju.clone
 jm.git.gists = copy(list)
}

jm.git.ready = function(data) {
  var t = data.responseText
  try {
   eval(t)
  } catch(err) { console.log(err) }
}

jm.git.loadGists = function(list) {
  log('Initial retrieval complete, searching for EdenJ Mods...')
  log(list)
  jm.git.assignList(list)

  var modsFile = 'EdenJ Mods'
  var modURL
  // Acquisition GitHub version of Mods list
  for (var i=0; i<list.length; i++) {
   var n = list[i]
   var desc = n.description
   if (desc == modsFile) {
     var o = n.files
     for (var k in o) {
      var detail = o[k]
          modURL = detail.raw_url || ''
      // Should only have 1 file as EdenJ Mods
      break
     }
     break
   }
  }

  // Retrieve & Run EdenJ Mods
  $.ajax({
   url: modURL,
   complete: jm.git.ready,
  })
}