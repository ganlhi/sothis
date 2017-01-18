'use strict'

const Expander = require('./expander')


/**
 * Handles LEDs used to indicate which relays are ON
 *
 * @class Leds
 * @extends {Expander}
 */
class Leds extends Expander {

  static errorMessage(type, value) {
    switch (type) {
    case 'name':
      return `Unknown LED named ${value}`
    case 'state':
      return `Invalid state ${value}`
    default:
      return null
    }
  }

  constructor(address) {
    super(address || 0x20)
    this.send(this._states)
  }

  getState(name) {
    if (!this._nums.hasOwnProperty(name)) {
      throw new Error(this.class.errorMessage('name', name))
    }

    return Boolean(this._states[this._nums[name]])
  }

  setState(name, state) {
    if (!this._nums.hasOwnProperty(name)) {
      throw new Error(this.class.errorMessage('name', name))
    }

    if (typeof state !== 'boolean') {
      throw new Error(this.class.errorMessage('state', state))
    }

    this._states[this._nums[name]] = Number(state)

    return this.send(this._states)
  }

  toggleState(name) {
    return this.setState(name, !this.getState(name))
  }

}

module.exports = Leds