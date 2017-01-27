'use strict'

const Expander = require('./expander')


/**
 * Handles LEDs used to indicate which relays are ON
 *
 * @class Leds
 * @extends {Expander}
 */
class Leds extends Expander {

  constructor(address) {
    super(address || 0x20)
    this.send(this._states)
  }

  errorMessage(type, value) {
    switch (type) {
    case 'name':
      return `Unknown LED named ${value}`
    case 'state':
      return `Invalid state ${value}`
    default:
      return null
    }
  }

  getState(name) {
    if (!this._nums.hasOwnProperty(name)) {
      throw new Error(this.errorMessage('name', name))
    }

    return Boolean(this._states[this._nums[name]])
  }

  setState(name, state) {
    if (!this._nums.hasOwnProperty(name)) {
      throw new Error(this.errorMessage('name', name))
    }

    if (typeof state !== 'boolean') {
      throw new Error(this.errorMessage('state', state))
    }

    this._states[this._nums[name]] = Number(state)

    return this.send(this._states).then(() => {
      console.log('Send', name, state)
      this.emit('state', name, this.getState(name))
    })
  }

  toggleState(name) {
    return this.setState(name, !this.getState(name))
  }

}

module.exports = Leds