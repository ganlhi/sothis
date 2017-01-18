'use strict'

// const Leds = require('./lib/leds')
// const Buttons = require('./lib/buttons')

// const leds = new Leds()
// const buttons = new Buttons()

// buttons.on('push', name => {
//   console.log(`Push ${name}`)
//   leds.toggleState(name)
// })

// setInterval(() => {}, 1000)

const server = require('diet')
const app = server()
app.listen('http://localhost:8000')

let states = {
  mount: 1,
  dslr: 0,
  roofOpen: 0,
  roofClose: 0
}

app.get('/:name', function($) {
  if (!states.hasOwnProperty($.params.name)) {
    $.failure()
  } else {
    let data = {}
    data[$.params.name] = states[$.params.name]
    $.json(data)
  }
})

app.post('/roof/:action', function($) {
  if ($.params.action === 'open') {
    states.roofClose = 0
    states.roofOpen = 1
    setTimeout(() => {
      states.roofOpen = 0
      $.json({ roof: 'open' })
    }, 10000)
  } else if ($.params.action === 'close') {
    states.roofClose = 1
    states.roofOpen = 0
    setTimeout(() => {
      states.roofClose = 0
      $.json({ roof: 'close' })
    }, 10000)
  } else {
    $.failure()
  }
})

app.post('/:name/:state', function($) {
  if (!states.hasOwnProperty($.params.name) || ($.params.state != 1 && $.params.state != 0)) {
    $.failure()
  } else {
    states[$.params.name] = $.params.state
    let data = {}
    data[$.params.name] = $.params.state
    $.json(data)
  }
})