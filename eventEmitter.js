// Import the logEvents object we created in logEvents.js
const logEvents = require('./logEvents');

// Import the events module so we can make an event emitter to track events
const EventEmitter = require('events');
// const { setTimeout } = require('timers/promises');
// Create an Emitter object
class MyEmitter extends EventEmitter {};

// Initialize object
const myEmitter =  new MyEmitter();

// Add a listener for the log event
myEmitter.on('log', (msg) => logEvents(msg));

setTimeout(() => {
  // Emit the event, add any other parameters you want to emit here
  myEmitter.emit('log','Log event emitted!');
}, 2000);