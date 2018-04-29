
/*
  Triggers
  
 */

Tr = typeof Tr !== 'undefined' ? Tr : {}

Tr.gsnub = function(line,pattern,newPattern) {
  line = line.replace(pattern,
    function (str) {
      if (Tr.ignorables.indexOf(str) <= -1) {
        return newPattern
      } else {
        return str
      }
    })
  return line
}

Tr.process = function(event,line,type,matched) {
  if (matched == 'true') { return {line: line, original: line} }
  if (type == 'prompt') { return {line: line, original: line} }
  if (type == 'chatter') { return {line: line, original: line} }
  if (line.match(/^$/g)) { return {line: line, original: line} } // ignore empty lines
  if (line.match(/\<PROMPT\>/g)) { return {line: line, original: line} } // ignore prompts
  if (line.match(/\(.+?\)\: .*/g)) { return {line: line, original: line} } // ignore chatter

  var original = line

  // swap out \u0001, \u001b
  line = line.replace(/\\u0001/g,'').replace(/\\u001b/g,'')

  // swap out (, )
  line = line.replace(/\(/g,'\\(')
  line = line.replace(/\)/g,'\\)')

  // protect *, -
  line = line.replace(/\*/g,'\*')
  line = line.replace(/\-/g,'\\-')

  // identify names
  line = Tr.gsnub(line,/[A-Z][a-z\-\']+\b/g,'(\\w+)') 

  // swap out his, her
  line = line.replace(/\bhis\b/g,'h(?:is|er)')
  line = line.replace(/\bher\b/g,'h(?:is|er)')
  line = line.replace(/^He /g,'^(?:He|She) ')
  line = line.replace(/^She /g,'^(?:He|She) ')

  // swap out pure numbers
  line = line.replace(/ \d+ /g		, ' (\\d+) '	)
  line = line.replace(/ \d+\% /g	, ' (\\d+)\% '	)
  line = line.replace(/ \d+\./g		, ' (\\d+)\.'	)
  line = line.replace(/ \d+\$/g		, ' (\\d+)\$'	)
  line = line.replace(/\(\d+/g		, '\((\\d+)'	)
  line = line.replace(/\d+\)/g		, '(\\d+)\)'	)

  // swap out numbers not preceeded by letters
  line = line.replace(/\#\d+/g		, '\#(\\d+)'	)
  line = line.replace(/\d+\//g		, '(\\d+)\/'	)
  line = line.replace(/\/\d+/g		, '\/(\\d+)'	)
  line = line.replace(/\d+\:/g		, '(\\d+)\:'	)
  line = line.replace(/\:\d+/g		, '\:(\\d+)'	)

  // compact spaces
  // line = line.replace(/\s\s+/g		, '[ ]+')
  // line = line.replace(/[\\\*]+/g	, '[\\\*]+')

  line = '^' + line
  line = line.replace(/\.$/g			, '\\.')
  line = line + '$'
	
  if (line == '^$') { return {line: line, original: line} }
  return {line: line, original: original}
}

Tr.ignorables = [
	'A',
	'An',
	'In',
	'It',
	'The',
	'There',
	'This',
	'To',
	'What',
	'You',
	'Your',
	
	'Age',
	'Announce',
	'Autocuring',
	'Avatar',
	'Balance',
	'Being',
	'Black',
	'Bloodline',
	'City',
	'Character',
	'Class',
	'Comments',
	'Con',
	'Creator',
	'Credits',
	'Cult',
	'Current',
	'Defences',
	'Dex',
	'Elections',
	'Events',
	'Fas',
	'Finding',
	'FULL',
	'Gender',
	'Guild',
	'Hand',
	'Health',
	'Info',
	'Information',
	'Int',
	'Left',
	'Level',
	'Lessons',
	'Loud',
	'Mana',
	'Meets',
	'Member',
	'Misc',
	'Name',
	'News',
	'Nothing',
	'Poetry',
	'Position',
	'Public',
	'Race',
	'Rank',
	'Reserves',
	'Right',
	'SCORE',
	'Sect',
	'Statpack',
	'Str',
	'Taken',
	'Time',
	'Today',
	'Token',
	'Tokens',
	'Total',
	'Type',
	'Use',
	'Vita',
	'We',
	'Wielded',
	
	
	'Antioch',
	'Caanae',
	'Celidon',
	'Kinsarmar',
	'Khandava',
	'Ithaqua',
	'Stavenn',
	
	'Amazon',
	'Assassin',
	'Bard',
	'Berserker',
	'Deathknight',
	'Defiler',
	'Diabolist',
	'Druid',
	'Hunter',
	'Mage',
	'Monk',
	'Outrider',
	'Predator',
	'Priest',
	'Ranger',
	'Renegade',
	'Runeguard',
	'Shaman',
	'Summoner',
	'Templar',
	
	'Grain',
	'Sandstorm',
	'Shamali',
	'Felah',
	'Nomad',
]