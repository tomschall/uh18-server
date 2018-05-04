/**
 * OSC class to receive OSC messages
 *
 */
"use strict";

class OscServer {
  /**
   *
   * @param {Number} port to listen for OSC messages
   * @param {websocketServer} socket to send/receive messages
   */
  constructor(port = 57121, wsTarget = null) {
    let osc = require("osc");
    this.port = port;
    this.websocketTarget = wsTarget;
    this.udpPort = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: this.port
    });
    // start osc port
    this.udpPort.open();
    this.udpPort.on("ready", this.onReady.bind(this));
    this.udpPort.on("message", this.onMessage.bind(this));
  }

  onReady() {
    console.log("Listening for OSC over UDP Port: " + this.port);
  }

  onMessage(oscMessage) {
    console.log("Received OSC message", oscMessage);
    // forward to UI via websockets
    this.emitOscMessage(oscMessage);
  }

  emitOscMessage(message) {
    if (this.websocketTarget.socket) {
      console.log("Emit OSC message: ", message);
      this.websocketTarget.socket.emit("oscMessage", {
        address: message.address,
        data: message.args /*, 
        isNew: message.isNew */
      });
    } else {
      console.log("No client found to forward OSC message.");
    }
  }
}

module.exports.OscServer = OscServer;
