'use strict'

const Board = require('firmata')
const leftPad = require('left-pad')
const EventEmitter = require('events')

const BYTES_NUM = 8


/**
 * Base class handling IO through a PCF8574 expander
 *
 * @class Expander
 */
class Expander extends EventEmitter {

  constructor() {
    super()

    this._invertedLogic = false

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

  connect(board, address) {
    this._address = address
    this._board = board
    this._board.on('ready', () => {
      this._board.i2cConfig()
      this.emit('ready')
    })
  }

  send(values) {
    if (!this._board || (this._board && !this._board.isReady)) {
      return new Promise((resolve, reject) => {
        this.on('ready', () => {
          this.send(values)
            .then(() => resolve())
            .catch(err => reject(err))
        })
      })
    }

    if (this._invertedLogic) {
      values = Expander.invertValues(values)
    }

    return new Promise((resolve, reject) => {
      try {
        this._board.i2cWrite(
          this._address,
          [Expander.fromArray(values)]
        )

        resolve()
      } catch (err) {
        reject(err)
      }
    })
  }

  receive() {
    if (!this._board || (this._board && !this._board.isReady)) {
      this.on('ready', () => {
        this.receive()
      })
      return
    }

    this._board.i2cRead(this._address, 1, (data) => {
      let values = Expander.toArray(data[0])
      if (this._invertedLogic) {
        values = Expander.invertValues(values)
      }
      this.emit('receive', values)
    })
  }

  static fromArray(arr) {
    const str = leftPad(arr.join(''), BYTES_NUM, '0')
    const bin = parseInt(str, 2)
    return bin
  }

  static toArray(bin) {
    const str =  leftPad(bin.toString(2), BYTES_NUM, '0')
    const arr = str.split('').map(v => parseInt(v, 10))
    return arr
  }

  static invertValues(arr) {
    return arr.map(v => 1 - v)
  }

}


module.exports = Expander