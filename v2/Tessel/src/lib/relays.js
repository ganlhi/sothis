'use strict'

const Leds = require('./leds')

module.exports = Relays


/**
 * Handles 8 relays
 *
 * @class Relays
 * @extends {Leds}
 */
class Relays extends Leds {

  static errorMessage(type, value) {
    switch (type) {
    case 'name':
      return `Unknown relay named ${value}`
    case 'state':
      return `Invalid state ${value}`
    default:
      return null
    }
  }

  constructor(address = 0x22) {
    super(address)
  }

}