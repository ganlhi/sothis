'use strict'

const tessel = require('tessel')

module.exports = Expander


const BYTES_NUM = 8


/**
 * Base class handling IO through a PCF8574 expander
 *
 * @class Expander
 */
class Expander {

  constructor(address, port = 'A') {
    this._i2c = tessel.port[port].I2C(address)
  }

  send(values) {
    return new Promise((resolve, reject) => {
      const buf = new Buffer([Expander.fromArray(values)])
      this._i2c.send(buf, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  receive() {
    return new Promise((resolve, reject) => {
      this._i2c.read(BYTES_NUM, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(Expander.toArray(data))
        }
      })
    })
  }

  static fromArray(arr) {
    const str = arr.join('')
    const bin = parseInt(str, 2)
    return bin
  }

  static toArray(bin) {
    const str = bin.toString(2)
    const arr = str.split('')
    return arr
  }

}
