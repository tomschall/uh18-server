/**
 * OSC class to receive OSC messages
 */
"use strict";

class OscServer {
  constructor(port = 57121) {
    let osc = require("osc");
    this.port = port;

    // start osc port
    this.udpPort = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: this.port
    });
    this.udpPort.open();

    this.udpPort.on("ready", this.onReady.bind(this));

    this.udpPort.on("message", this.onMessage(oscMessage).bind(this));
  }

  onReady() {
    console.log("Listening for OSC over UDP Port: " + this.port);
  }

  onMessage(oscMessage) {
    console.log("Received OSC message", oscMessage);
  }
}

module.exports.OscServer = OscServer;
