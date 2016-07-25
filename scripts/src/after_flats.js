'use strict';

let every     = require('../every.js');
let config    = require('../config');
let WebSocket = require('ws');

let ws = new WebSocket(config.url);

let topicsDone = {
  'shutter/scope': false,
  'switch/flat': false
}

let targetState = false;

ws.on('open', () => {
  for (let topic in topicsDone) {
    console.log(`Request ${topic} state ${targetState}`);
    ws.send(JSON.stringify({
      topic,
      payload: targetState
    }));  
  }
})

ws.on('message', data => {
  let response = JSON.parse(data);
  let topic    = response.topic;
  
  if (topicsDone.hasOwnProperty(topic) 
    && response.payload === targetState) 
  {
    console.log(`${topic}: ${response.payload}`);
    topicsDone[topic] = true;
    if (every(topicsDone, true)) {
      ws.close();
      console.log('All OK - Exit in 1 second');
      setTimeout(() => process.exit(), 1000);
    }
  }
});  
