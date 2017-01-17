'use strict'

const Expander = require('./expander')

module.exports = Buttons


/**
 * Handles buttons to manually toggle relays
 *
 * @class Buttons
 * @extends {Expander}
 */
class Buttons extends Expander {

  constructor(address = 0x21) {
    super(address)

  }
}