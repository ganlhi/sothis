'use strict';

let every     = require('../every.js');
let config    = require('../config');
let WebSocket = require('ws');

let finalSteps = false;

let ws = new WebSocket(config.url);

ws.on('open', startShutdown);

function startShutdown() {
  let topicsDone = {
    'shutter/scope': false,
    'shutter/guide': false,
    'switch/flat': false,
    'roof': false
  }

  let targetState = false;
  
  for (let topic in topicsDone) {
    console.log(`Request ${topic} state ${targetState}`);
    ws.send(JSON.stringify({
      topic,
      payload: targetState
    }));  
  }

  ws.on('message', data => {
    if (finalSteps) return;

    let response = JSON.parse(data);
    let topic    = response.topic;
    
    if (topicsDone.hasOwnProperty(topic) 
      && response.payload === targetState) 
    {
      console.log(`${topic}: ${response.payload}`);
      topicsDone[topic] = true;
      if (every(topicsDone, true)) {
        console.log('All OK - Final actions in 1 second');
        setTimeout(finishShutdown, 1000);
      }
    }
  });  
}

function finishShutdown() {
  finalSteps = true;

  let topicsDone = {
    'switch/lock': false,
    'switch/mount': false,
    'switch/camera': false
  }

  let targetState = {
    'switch/lock': true,
    'switch/mount': false,
    'switch/camera': false
  };
  
  for (let topic in topicsDone) {
    console.log(`Request ${topic} state ${targetState[topic]}`);
    ws.send(JSON.stringify({
      topic,
      payload: targetState[topic]
    }));  
  }

  ws.on('message', data => {
    if (!finalSteps) return;

    let response = JSON.parse(data);
    let topic    = response.topic;
    
    if (topicsDone.hasOwnProperty(topic) 
      && response.payload === targetState[topic]) 
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
} 