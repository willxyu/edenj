
mapper = (function() {
 
 var init = function() {
  // grab assets
  // window
  // pane
  
  // behaviours: panning
  // behaviours: scroll
  // behaviours: hover

 $('#map-container').remove()
  // window & pane
  var d = ''
      d += '<div id="map-container">'
      d += '<svg id="map">'
      d += '</svg></div>'
  $('body').append(d)
 }

 var render = function() {
  // get location
  // generate data
  var loc  = gmcp || {}
      loc  = gmcp.Room || {}
      loc  = gmcp.Room.Info || {}
  var num  = loc.num || 0
  var c    = loc.coords
  var area = c.match(/^\d+/)
      area = area[0] || 0
  var a    = mapdb.map.composite[area]
  var r    = a[num] || mapdb.map.rooms[num]
  var x    = 0

  log(a.name)
  log(a.adjs)
  log(r)

  update()
 }

 update = function(posFrom, posTo) {
 }

 // api
 a2a = function(areaFrom, areaTo) {
  // https://hackernoon.com/how-to-implement-dijkstras-algorithm-in-javascript-abdfd1702d04
  var t = ju.clone(mapdb.map.hashareas)
  var costs     = {}
  var ancestors = {}
  var memory    = []
  var registerNode   = function(whom) { if (!memory.includes(whom)) { memory.push(whom) } }
  var recordCost     = function(whom, price) { costs[whom] = price }
  var recordAncestry = function(whom, familytree) {
   if (familytree == areaFrom) { return } // stop registering 113 = 114 & 114 = 113 infinity loop
   ancestors[whom] = familytree
  }
  
  // initialise
  recordCost(areaFrom, 0)
  recordCost(areaTo, Infinity)
  for (var children in t[areaFrom]) { recordAncestry(children, areaFrom) }

  var lowestCostNode = function(costs, processed) {
   var lowest = null
   var marker = 0
   for (var node in costs) {
    if (lowest === null || costs[node] < lowest) {
      if (!processed.includes(node)) {
       lowest = costs[node]
       marker = node
      }
    }
   }
   return marker
  }
  var node = lowestCostNode(costs, memory)

  while (node) {
   let cost = costs[node]
   let children = t[node]
   for (let n in children) {
    let newCost = cost + children[n]
    if (!costs[n]) {
      costs[n] = newCost
      recordAncestry(n, node)
    }
    // cheaper route
    if (costs[n] > newCost) {
      costs[n] = newCost
      recordAncestry(n, node)
    }
   }
   registerNode(node)
   node = lowestCostNode(costs, memory)
  }

  // if you wanted to, you could pick more than 1 path by dismembering the optimal path
  //   forcing a redirect down a different and new 'optimum'

  let optimal = [areaTo]
  let p = ancestors[areaTo]
  while (p) {
   optimal.push(p)
   p = ancestors[p]
  }
  optimal.reverse()
  
  log(costs[areaTo])
  log(optimal)
  var t = mapdb.map.composite
  var s = ''
  s += 'In ' + costs[areaTo] + ' area-steps, '
  var fname = t[String(areaFrom)].name
  if (fname.match(',')) { var u = fname.split(','); fname = u[1].trim() + ' ' + u[0] }
      tname = t[areaTo].name
  if (tname.match(',')) { var u = tname.split(','); tname = u[1] + ' ' + u[0] }
  s += 'travel from <i>' + fname + '</i> via ' 
  optimal.pop()
  for (var k in optimal) {
   var name = t[optimal[k]].name
   if (name.match(',')) {
    var u = name.split(',')
    name = u[1] + ' ' + u[0]
   }
   s += '<i>' + name + '</i>, '
  }
  s +=  ' to <i>' + tname + '</i>.'
  jprint(s + '\n')
  // return costs
 }

 // api
 var r2r = function(roomFrom, roomTo) {
  // https://hackernoon.com/how-to-implement-dijkstras-algorithm-in-javascript-abdfd1702d04
  var t = mapdb.map.hashrooms
  var costs     = {}
  var ancestors = {}
  var memory    = []
  
  // initialise
  var recordCost = function(whom, price) {
   costs[whom] = price
  }
  var recordAncestry = function(whom, familytree) {
   if (familytree == roomFrom) { return } // stop registering 113 = 114 & 114 = 113 infinity loop
   ancestors[whom] = familytree
  }
  var registerNode = function(whom) {
   if (memory.includes(whom)) { } else {
     memory.push(whom)
   }
  }
  recordCost(roomFrom, 0)
  recordCost(roomTo, Infinity)
  for (var children in t[roomFrom]) {
   recordAncestry(children, roomFrom)
  }

  var lowestCostNode = function(costs, processed) {
   var lowest = null
   var marker = 0
   for (var node in costs) {
    if (lowest === null || costs[node] < lowest) {
      if (!processed.includes(node)) {
       lowest = costs[node]
       marker = node
      }
    }
   }
   return marker
  }
  var node = lowestCostNode(costs, memory)

  while (node) {
   let cost = costs[node]
   let children = t[node]
   for (let n in children) {
    let newCost = cost + children[n]
    if (!costs[n]) {
      costs[n] = newCost
      recordAncestry(n, node)
    }
    // cheaper route
    if (costs[n] > newCost) {
      costs[n] = newCost
      recordAncestry(n, node)
    }
   }
   registerNode(node)
   node = lowestCostNode(costs, memory)
  }

  // if you wanted to, you could pick more than 1 path by dismembering the optimal path
  //   forcing a redirect down a different and new 'optimum'
  // `js r2r(37631,3661)

  let optimal = [roomTo]
  let p = ancestors[roomTo]
  while (p) {
   optimal.push(p)
   p = ancestors[p]
  }
  optimal.reverse()
  
  log(costs[roomTo])
  log(optimal)
  // return costs
 }

 return {
   init      : init,
   render    : render,
   update    : update,
   // api
   a2a       : a2a,
   r2r       : r2r,
 }
})()

a2a = mapper.a2a
r2r = mapper.r2r

// `js mapper.area2area(49,115)