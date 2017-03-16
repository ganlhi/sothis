'use strict'

const debounce = require('debounce')

const Board = require('firmata')

const Leds = require('./lib/leds')
const Buttons = require('./lib/buttons')
const Relays = require('./lib/relays')

const leds = new Leds()
const buttons = new Buttons()
const relays = new Relays()

const server = require('diet')
const app = server()

const WebSocket = require('ws')
const wss = new WebSocket.Server({
  perMessageDeflate: false,
  port: 8001
})

buttons.on('push', debounce(name => {
  console.log(`Push ${name}`)
  relays.toggleState(name)
}, 100))

relays.on('state', (name, state) => {
  console.log(`State of ${name}: ${state}`)
  let data = {}
  data[name] = state
  broadcast(data)
  leds.setState(name, state)
})

wss.on('connection', ws => {
  console.log('WS connection')
})

function broadcast(data) {
  console.log('Broadcasting to '+wss.clients.length+' clients: ', data)
  wss.clients.forEach(client => {
    console.log('Client state: ', client.readyState)
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  })
}

app.get('/:name', function($) {
  try {
    const state = relays.getState($.params.name)
    let data = {}
    data[$.params.name] = state
    $.json(data)
  } catch(err) {
    $.failure()
  }
})

const ROOF_OPEN_TIME = 40000
const ROOF_CLOSE_TIME = 40000
app.post('/roof/:action', function($) {
  try {
    if ($.params.action === 'open') {
      relays.setState('roofOpen', true)
      setTimeout(() => {
        relays.setState('roofOpen', false)
          .then(() => broadcast({ roof: 'opened' }))
      }, ROOF_OPEN_TIME)
      let data = { roof: 'opening' }
      broadcast(data)
      $.json(data)
    } else if ($.params.action === 'close') {
      relays.setState('roofClose', true)
      setTimeout(() => {
        relays.setState('roofClose', false)
          .then(() => broadcast({ roof: 'closed' }))
      }, ROOF_CLOSE_TIME)
      let data = { roof: 'closing' }
      broadcast(data)
      $.json(data)
    } else {
      console.error('ELSE ERR')
      $.failure()
    }
  } catch(err) {
    console.error(err)
    $.failure()
  }
})

app.post('/:name/:state', function($) {
  try {
    const state = Boolean(parseInt($.params.state, 10))
    const name = $.params.name

    relays.setState(name, state)
      .then(() => {
        let data = {}
        data[name] = relays.getState(name)
        $.json(data)
      })
      .catch((err) => {
        console.error('Promise', err)
        $.failure()
      })
  } catch(err) {
    console.error('Catch', err)
    $.failure()
  }
})



// Start
function initBoardAndListen() {
  Board.requestPort((error, port) => {
    if (error) {
      console.error('Error requesting port: '+error)
      setTimeout(initBoardAndListen, 10000)
      return
    }

    const board = new Board(port.comName)

    leds.connect(board, 0x20)
    relays.connect(board, 0x21)
    buttons.connect(board, 0x22)

    app.listen('http://localhost:8000')
  })
}

initBoardAndListen()