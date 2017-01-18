'use strict'

const tessel = require('tessel')
const leftPad = require('left-pad')
const EventEmitter = require('events')

const BYTES_NUM = 8


/**
 * Base class handling IO through a PCF8574 expander
 *
 * @class Expander
 */
class Expander extends EventEmitter {

  constructor(address, port) {
    super()
    this._i2c = tessel.port[port || 'A'].I2C(address)

    this._nums = {
      mount:     0,
      usb:       1,
      focuser:   2,
      dslr:      3,
      roofOpen:  4,
      roofClose: 5,
      roofLock:  6,
      fan:       7
    }

    this._states = Array.from({ length: 8 }, () => 0)
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
      this._i2c.read(1, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(Expander.toArray(data.readUInt8()))
        }
      })
    })
  }

  static fromArray(arr) {
    const str = leftPad(arr.join(''), BYTES_NUM, '0')
    const bin = parseInt(str, 2)
    return bin
  }

  static toArray(bin) {
    const str =  leftPad(bin.toString(2), BYTES_NUM, '0')
    const arr = str.split('')
    return arr
  }

}


module.exports = Expander