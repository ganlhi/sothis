'use strict';

let every     = require('../every.js');
let config    = require('../config');
let WebSocket = require('ws');

let ws = new WebSocket(config.url);

let topicsDone = {
  'scope': false,
  'guide': false
}

let topicPrefix = 'shutter';
let targetState = false;

ws.on('open', () => {
  for (let topic in topicsDone) {
    console.log(`Request ${topic} ${topicPrefix} state ${targetState}`);
    ws.send(JSON.stringify({
      topic: `${topicPrefix}/${topic}`,
      payload: targetState
    }));  
  }
})

ws.on('message', data => {
  let response = JSON.parse(data);
  let topic    = response.topic.split('/')[1];
  
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
