function loadCSS(href) {
  var css = $('<link>', {
    'rel'   :  'stylesheet',
    'type'  :  'text/css',
    'href'  :  href,
  })[0];
  document
    .getElementsByTagName('head')[0]
    .appendChild(css);
}


reloadCSS = function() {
  var list = [
    'core/csMain.css',
    'core/csColors.css',
    'core/extlib/jquery-ui.css',
  ]
  for (var i=(list.length-1);i>-1;i--) {
    loadCSS(list[i]);
  }
}

reloadCSS()