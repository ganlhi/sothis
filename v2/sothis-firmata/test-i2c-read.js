'use strict'

var Board = require('firmata');

Board.requestPort(function(error, port) {
  if (error) {
    console.log(error);
    return;
  }

  var board = new Board(port.comName);

  console.log(__filename);
  console.log('------------------------------');

  board.on('open', function() {
    console.log('  ✔ open');
  });

  board.on('reportversion', function() {
    console.log('  ✔ reportversion');
  });

  board.on('queryfirmware', function() {
    console.log('  ✔ queryfirmware');
  });

  board.on('capability-query', function() {
    console.log('  ✔ capability-query');
  });

  board.on('ready', function() {
    console.log('  ✔ ready');
    clearTimeout(timeout);

    this.i2cConfig();
    // this.i2cRead(0x22, 1, function(data) {
    //   console.log('  ✔ received data');
    //   console.log(data);
    //   console.log('------------------------------');
    //   // process.exit();
    // });

    var state = 0;

    setInterval(() => {
      state = 0xff - state;
      this.i2cWrite(0x20, [state])
      console.log('BOARD READY!', board.isReady)
    }, 1000)
  });

  var timeout = setTimeout(function() {
    console.log(board.currentBuffer);
    console.log('>>>>>>>>>>>>>>TIMEOUT<<<<<<<<<<<<<<');
    console.log('------------------------------');
    process.exit();
  }, 10000);
});
