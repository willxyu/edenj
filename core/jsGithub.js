

jm = typeof jm !== 'undefined' ? jm : {}

jm.git = jm.git || {}

jm.git.check = function() {
  $.ajax({
   type: 'GET',
   cache: true,
   url: 'https://github.com/login/oauth/authorize',
  })
}

jm.git.draw_login = function() {

}

checkgit = jm.git.check
