

jm = typeof jm !== 'undefined' ? jm : {}

jm.git       = jm.git       || {}

jm.git.systemReady  = false // do not take the previous value as we are refreshing with the system
jm.git.modsFileName = 'EdenJ Mods'

jm.git.token = jm.git.token || ''
jm.git.gists = jm.git.gists || []

jm.git.assignToken = function(token) {
 jm.git.token = token }

jm.git.assignList = function(list) {
 var copy = ju.clone
 jm.git.gists = copy(list) }

jm.git.begin = function() {
 var token
 var url = window.location.href
 if (url.match(/\?code\=[a-z0-9]{20,20}$/i)) {
   var c = url.replace(/.*?\?code\=/,'')
   var uri  = 'https://cors-anywhere.herokuapp.com/'
       uri += 'https://github.com/login/oauth/access_token'
       uri += '?client_id=6e13bece29ffd812bb17' + '&'
       uri += 'client_secret=c377bb5f163d235ca37b3c656fe10f19b085caea' + '&'
       uri += 'code=' + c
   $.ajax({
    type: 'POST',
    url : uri,
    success: jm.git.receiveToken,
   })
 } }

jm.git.receiveToken = function(data) {
 var token = undefined
 var RE    = /access_token=(.*?)&/g
 var match = RE.exec(data)
 if (match) { token = match[1] }
 log('Token: ' + token)
 jm.git.assignToken(token)
 
 if (jm.git.systemReady = true) { // if we were slow in receiving a token
   jm.git.requestGists()
 } }

jm.git.requestGists = function() {
 jm.git.systemReady = true // ! to help a slowly arriving .receiveToken
 var token = jm.git.token
 if (typeof token !== 'undefined' && token !== '' ) {
   $.ajax({
    type: 'GET',
    url : 'https://api.github.com/gists?access_token=' + token,
    success: jm.git.loadGists,
   })
 } }

jm.git.loadGists = function(list) {
  log('Initial retrieval complete, searching for EdenJ Mods...')
  log(list)
  // Replace bar to hide token
  window.history.replaceState({}, '', window.location.href.replace(/\?code\=.*$/,''))
  
  jm.git.assignList(list)

  var modsFile = jm.git.modsFileName
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
  }) }

jm.git.ready = function(data) {
  var t = data.responseText
  try {
   eval(t)
  } catch(err) { console.log(err) } }

GithubSystemReady = jm.git.requestGists