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

  emitOscMessage(oscMessage) {
    if (this.websocketTarget.socket) {
      console.log("Emit OSC message: ", oscMessage);
      this.oscConfig.getConfig(oscMessage).then(this._mergeWithConfigAndEmit.bind(this));
    } else {
      console.log("No client found to forward OSC message.");
    }
  }

  _mergeWithConfigAndEmit(messageAndConfig) {
    let websocketMessage = {
      address: messageAndConfig.message.address,
      config: messageAndConfig.config,
      data: messageAndConfig.message.args
    };
    this.websocketTarget.socket.emit("oscMessage", websocketMessage);
  }
}

module.exports.OscServer = OscServer;
