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
  constructor(config) {
    if (config.port == null) config.port = 57121;
    this.port = config.port;
    this.websocketTarget = config.websocketServer;
    this.oscConfig = config.configProvider;

    let osc = require("osc");
    this.udpPort = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: this.port
    });
    // start listening on osc port
    this.udpPort.open();
    this.udpPort.on("ready", this.onReady.bind(this));
    this.udpPort.on("message", this.onMessage.bind(this));
  }

  onReady() {
    console.log("Listening for OSC over UDP Port: " + this.port);
  }

  onMessage(oscMessage) {
    this.emitOscMessage(oscMessage);
  }

  // Get stored configuration if preset and forward to UI via websockets
  emitOscMessage(oscMessage) {
    if (this.websocketTarget.socket) {
      this.oscConfig.getConfiguredMessage(oscMessage).then(function(message) {
        let websocketMessage = {
          address: message.message.address,
          config: message.config,
          data: message.message.args
        };
        this.websocketTarget.socket.emit("oscMessage", websocketMessage);
      });
    } else {
      console.log("No client found to forward OSC message.");
    }
  }
}

module.exports.OscServer = OscServer;
