import clock from "clock";
import * as messaging from "messaging";
import { CryptoUI } from './ui';

// Update the clock every second
clock.granularity = "minutes";

const ui = new CryptoUI();

messaging.peerSocket.onopen = function() {
  messaging.peerSocket.send("Hi");
}

messaging.peerSocket.onmessage = function(evt) {
  ui.updateChart(evt.data);
}

// Update the clock every tick event
clock.ontick = function() {
  ui.updateClock();
  messaging.peerSocket.send("Hi");
}