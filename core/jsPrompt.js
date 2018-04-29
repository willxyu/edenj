prompt = function(line) {
  promptLine = line
  if (typeof me !== 'undefined') {
    me.prompt()
  }
  if (typeof cb !== 'undefined') {
    // cb.prompt()
  }
  if (typeof cl !== 'undefined') {
    var s = cl.prompt()
    // tagOn(s)
  }
  if (typeof b !== 'undefined') { b.prompt() }
  if (typeof cbu !== 'undefined') {
    cbu.updateTarget()
  }
  if (typeof occultist !== 'undefined') {
    occultist.gagging = false
  }
  if (typeof runewarden !== 'undefined') {
    runewarden.prompt()
  }
  if (typeof px !== 'undefined') {
    px.mapbuffer = []
  }
  if (typeof dbf !== 'undefined') {
    dbf.prompt()
  }
  /*
  */
  // if (ship) { ship.prompt() }
  // if (dbf) { dbf.prompt() }
}