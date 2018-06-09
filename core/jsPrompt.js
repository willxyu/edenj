prompt = function(line) {
  promptLine = line
  if (typeof sys !== 'undefined' && typeof sys.prompt == 'function') { sys.prompt(line) }
}