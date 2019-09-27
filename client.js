#!/usr/bin/env node

var net = require("net");
var gamepad = require("gamepad");

var client = new net.Socket();
gamepad.init();

setInterval(gamepad.processEvents, 16);

const port = 1337;
const host = "raspberrypi.local";
const LEFT_STEAK = 14;
const RIGHT_STEAK = 15;
const SWAP_DIRECTION = 8;
const STOP = -1;
const MESSAGE_SUCCES_CONNECT = `connected: ${host}:${port}`;

let isForward = false;

const mapSpeed = value => {
  if (value === STOP) {
    return 0;
  }

  return 150;
};

const getForward = isForward => (isForward ? 1 : 2);

let action = {
  left: {
    speed: 0,
    forward: getForward(isForward)
  },
  right: {
    speed: 0,
    forward: getForward(isForward)
  }
};

const onGamepad = (id, axis, value) => {
  console.log(axis, value, id);

  if (axis === SWAP_DIRECTION) {
    isForward = !isForward;
  }

  if (axis === LEFT_STEAK) {
    action.left = {
      speed: mapSpeed(value),
      forward: getForward(isForward)
    };
  }

  if (axis === RIGHT_STEAK) {
    action.right = {
      speed: mapSpeed(value),
      forward: getForward(isForward)
    };
  }

  client.write(JSON.stringify(action) + "\n");
};

const onConnect = () => {
  console.log(MESSAGE_SUCCES_CONNECT);
  gamepad.on("move", onGamepad);
};

client.connect(port, host, onConnect);

process.on("uncaughtException", function(err) {
  client.connect(port, host, onConnect);
  console.log(err);
});
