#!/usr/bin/env node

var net = require("net");
var gamepad = require("gamepad");
var debounce = require("debounce");

var client = new net.Socket();
gamepad.init();

setInterval(gamepad.processEvents, 16);

function isForward(val) {
  const value = val.toString();

  if (value[0] === "-") return 2;

  return 1;
}

client.connect(
  1337,
  "raspberrypi.local",
  function() {
    gamepad.on(
      "move",
      debounce(function(id, axis, value) {
        const data = {
          id: id,
          axis: axis,
          value: value
        };

        let event = {
          signal: 0
        };

        if (axis === 0 || axis === 1) {
          event = {
            signal: 1,
            leftSpeed: 255,
            leftDirection: isForward(value)
          };
        }

        if (axis === 2 || axis === 3) {
          event = {
            signal: 1,
            rightSpeed: 255,
            rightDirection: isForward(value)
          };
        }
        event.signal && client.write(JSON.stringify(event));
      }, 10)
    );
  }
);
