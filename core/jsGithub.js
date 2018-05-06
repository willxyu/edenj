

jm = typeof jm !== 'undefined' ? jm : {}

jm.git       = jm.git       || {}

jm.git.token = jm.git.token || ''

jm.git.check = function() {

}

jm.git.draw_login = function() {

}

jm.git.assignToken = function(token) {
 jm.git.token = token
}

jm.git.loadGists = function(list) {
  console.log(list)
  for (var i=0; i<list.length; i++) {
   var n = list[i]
   if (typeof n.files !== 'undefined') {
     var o = n.files
     console.log(o)
   }
  }
  /*
            for (var i=0; i<m.length; i++) {
             var n = m[i]
             if (typeof n.files !== 'undefined') {
               n = n.files
               for (var k in n) {
                var detail = n[k]
                var urn    = detail.raw_url || ''
                $.ajax({
                  url: urn,
                  complete: function(a) {
                   var s
                   var t = a.responseText
                   try {
                     s = eval(t)
                   } catch(err) {
                     console.log(err)
                   }
                  }
                })
               }
             }
            }
  */
}

checkgit = jm.git.check
