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

  constructor(address) {
    super(address || 0x22)
  }

  setState(name, state) {
    // Roof mutual exclusion
    if (name === 'roofClose' && state > 0) {
      this.setState('roofOpen', 0)
    }

    if (name === 'roofOpen' && state > 0) {
      this.setState('roofClose', 0)
    }

    super(name, state)
  }

}