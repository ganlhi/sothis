'use strict'

const Expander = require('./expander')


/**
 * Handles buttons to manually toggle relays
 *
 * @class Buttons
 * @extends {Expander}
 */
class Buttons extends Expander {

  constructor(address) {
    super(address || 0x21)
    this._invertedLogic = true
    setInterval(() => this._pollButtons(), 100)
  }

  _pollButtons() {
    this.receive()
      .then(values => {
        values.forEach((v, i) => {
          if (v !== this._states[i]) {
            this._states[i] = v
            if (v > 0) {
              const name = Object.keys(this._nums)[i]
              this.emit('push', name)
            }
          }
        })
      })
      .catch(err => { console.error(err) })
  }
}

module.exports = Buttons