'use strict'

const Leds = require('./lib/leds')
const Buttons = require('./lib/buttons')

const leds = new Leds()
const buttons = new Buttons()

buttons.on('push', name => {
  console.log(`Push ${name}`)
  leds.toggleState(name)
})

setInterval(() => {}, 1000)

