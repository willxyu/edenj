
var t = {}
t.scripts = `
 +script
  ui = typeof ui !== 'undefined' ? ui : {}
  
  ui.bg = 'fit'
  ui.blur = 'blur(5px)'
  ui.img = 'user/ui/resources/bg_dragonFire.jpg'
  
  ui.augment = function() {
   var d = ''
   // handle background
   if (! $('#portrait').length) { 
    d = '<div id="portrait">'
    d += '</div>'
    $('#container').append(d)
   }
   switch (ui.bg) {
    case 'max':
     $('#portrait').css({
      'background-image': 'url("'+ui.img+'")',
      'background-repeat': 'no-repeat',
      'background-size': 'cover',
      'position': 'absolute',
      'left': '50%',
      'top' : '50%',
      'transform' : 'translate(-50%,-50%)',
      'width'  : '100%',
      'height' : '100%',
      'filter' : ui.blur,
      '-webkit-filter' : ui.blur,
      '-moz-filter' : ui.blur,
      '-o-filter' : ui.blur,
      'z-index' : '-5',
     })
     break;
    case 'fit':
     $('#portrait').css({
      'background-image': 'url("'+ui.img+'")',
      'background-size': 'contain',
      'background-repeat': 'no-repeat',
      'background-position': 'center center',
      'position': 'absolute',
      'left': '50%',
      'top' : '50%',
      'width'  : '500px',
      'height' : '360px',
      'transform' : 'translate(-50%,-50%)',
      'filter' : ui.blur,
      '-webkit-filter' : ui.blur,
      '-moz-filter' : ui.blur,
      '-o-filter' : ui.blur,
      'z-index' : '-5',
     })
     break;
    case 'none':
     $('#portrait').css({
      'display': 'none',
     })
     break;
    default:
     $('#portrait').css({
      'background-image': 'url("'+ui.img+'")',
      'background-repeat': 'no-repeat',
      'position': 'absolute',
      'left': '50%',
      'top' : '50%',
      'transform' : 'translate(-50%,-50%)',
      'width'  : '500px',
      'height' : '360px',
      'filter' : ui.blur,
      '-webkit-filter' : ui.blur,
      '-moz-filter' : ui.blur,
      '-o-filter' : ui.blur,
      'z-index' : '-5',
     })
     break;
   }
  }

  ui.connect = function() {
   $('#input').css('caret-color','rgba(45,155,45,1)')
  }

  ui.disconnect = function() {
   $('#input').css('caret-color','rgba(145,45,45,1)')
  }

 -script
`

t.triggers = `
`

t.aliases = `
 +alias
  +p ^bg\\.max$
  +do
    ui.bg = 'max'
    ui.augment()
  -en
 +alias
  +p ^bg\\.fit$
  +do
    ui.bg = 'fit'
    ui.augment()
  -en
 +alias
  +p ^bg\\.none$
  +do
    ui.bg = 'none'
    ui.augment()
  -en
 +alias
  +p ^bg\\.std$
  +p ^bg\\.min$
  +do
    ui.bg = 'std'
    ui.augment()
  -en
 +alias
  +p ^bg\\.img[ ]+(.*)$
  +do
    ui.img = 'user/ui/resources/'+matches[1]+'.jpg'
    ui.augment()
  -en
 +alias
  +p ^bg\\.blur[ ]+(.*)$
  +do
    ui.blur = 'blur('+matches[1]+'px)'
    ui.augment()
  -en
`
mods.register('ui',t)

// https://i.pinimg.com/originals/1a/3b/0d/1a3b0d754e88d1a400c6695c2c44a3f4.png
// https://i.pinimg.com/originals/a7/97/56/a79756280536f97921bcfd5154c39dc8.jpg
// http://hddesktopwallpapers.in/wp-content/uploads/2015/06/Gold-Wallpapers-dragon.jpg
// https://i.pinimg.com/originals/55/8e/b0/558eb0711833a04f1272c45be9e3904f.jpg
// https://i.pinimg.com/originals/df/1d/63/df1d63eb28e47a11a879ea07d41182d4.jpg
// https://i.pinimg.com/originals/ab/c2/48/abc248d7cdbee3e930d28d5933b56798.jpg
// http://media.wizards.com/images/magic/daily/wallpapers/AVR_1_2560x1600_Wallpaper_s412m0imfi.jpg
// https://images4.alphacoders.com/600/600921.jpg
// http://www.nmgncp.com/data/out/177/5127214-hd-wallpapers-fantasy.jpg
// http://www.guoguiyan.com/data/out/173/69696269-shadow-of-mordor-wallpapers.jpg
// https://4.bp.blogspot.com/-xHMBFkU2-so/U1aOR6lR6VI/AAAAAAAA0No/zhCg2SlRyyg/s0/Diablo+III_3_Ultra+HD.jpg
// http://media.blizzard.com/wow/media/wallpapers/other/blizzcon-2010/blizzcon-2010-1920x1080.jpg
// http://wallpapercraft.net/wp-content/uploads/2016/11/Elf-Wallpapers-HD-For-Desktop.jpg
// http://www.2kwp.com/wp-content/uploads/2016/11/Ship_005.jpg
// https://digitalart.io/storage/artworks/227/Yellow-King-Skull-Girl-Wallpaper.jpeg
// https://i.pinimg.com/originals/30/64/d9/3064d9f621add80aeab951cf007ebf82.jpg
// http://elder-scrolls.com/uploads/posts/2013-11/1384926870_6.jpg
// http://i.imgur.com/kybCF2F.jpg
// http://digitalresult.com/wp-content/uploads/2015/08/skeleton-hd-wallpapers-31.jpeg
// https://wallpaperscraft.com/image/mage_demon_magic_shield_attack_58211_1920x1200.jpg
// https://www.artstation.com/artwork/zGmWm
// https://www.artstation.com/artwork/xNKD2
// https://cdna.artstation.com/p/assets/images/images/004/426/488/large/daryl-mandryk-nighthunters.jpg?1483661858
// https://cdna.artstation.com/p/assets/images/images/001/224/252/large/dong-geon-son-15.jpg?1442507240
// https://img00.deviantart.net/78b2/i/2015/313/5/1/demon_sage_by_jasontn-d9g4u3o.jpg