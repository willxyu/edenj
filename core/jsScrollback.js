
/*
 Scrollback Handler

 requires:
  jv
   .scrollback
   .scrollbackOffset
  $

  uses:
   #output
   #addenda
   css
    .hidden
 */

jm = typeof jm !== 'undefined' ? jm : {}

jm.sbHandler = function() {
 var e = 'output'
 var a = '#addenda' // jquery
 var d = document.getElementById(e).scrollHeight
 var p = document.getElementById(e).scrollTop
 var h = document.getElementById(e).clientHeight
 var o = d - (p + h)
  
 if (o < jv.scrollbackOffset) {
  // too close to bottom
  jv.scrollback = false
  if (!$(a).hasClass('hidden')) { $(a).addClass('hidden'); $(a).empty() }  
  } else {
   // divert new input
   jv.scrollback = true
   if ($(a).hasClass('hidden')) { $(a).removeClass('hidden') }  
 }
}

jm.dblHandler = function() {
 fastdom.measure( function() {
  var h = document.getElementById('output').scrollHeight
  fastdom.mutate( function() {
   $('#output').scrollTop(h) }) })
 $('#addenda').addClass('hidden'); $('#addenda').empty()
 jv.scrollback = false
 var input = $('#input')
 input.focus()
}