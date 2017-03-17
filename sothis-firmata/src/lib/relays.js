'use strict'

const Leds = require('./leds')


/**
 * Handles 8 relays
 *
 * @class Relays
 * @extends {Leds}
 */
class Relays extends Leds {

  constructor() {
    super()

    this._invertedLogic = true

    for(let name in this._nums) {
      this.setState(name, false)
    }
  }

  errorMessage(type, value) {
    switch (type) {
    case 'name':
      return `Unknown relay named ${value}`
    case 'state':
      return `Invalid state ${value}`
    default:
      return null
    }
  }

  setState(name, state) {
    // Roof mutual exclusion
    if (name === 'roofClose' && state) {
      this.setState('roofOpen', false)
    }

    if (name === 'roofOpen' && state) {
      this.setState('roofClose', false)
    }

    return super.setState(name, state)
  }

  getStates() {
    let states = {}

    Object.keys(this._nums).forEach(name => {
      states[name] = Boolean(this._states[this._nums[name]])
    })

    return states
  }

}

module.exports = Relays