'use strict'

const Expander = require('./expander')


/**
 * Handles buttons to manually toggle relays
 *
 * @class Buttons
 * @extends {Expander}
 */
class Buttons extends Expander {

  constructor() {
    super()
    this._invertedLogic = true

    this.on('ready', () => this.receive())
    this.on('receive', values => this._onReceive(values))
  }

  _onReceive(values) {
    values.forEach((v, i) => {
      if (v !== this._states[i]) {
        this._states[i] = v
        if (v > 0) {
          const name = Object.keys(this._nums)[i]
          this.emit('push', name)
        }
      }
    })
  }
}

module.exports = Buttons