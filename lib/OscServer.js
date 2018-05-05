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
    // @todo: manage dependency better
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
    this.emitMessage(oscMessage);
  }

  // Get stored configuration if preset and forward to UI via websockets
  emitMessage(oscMessage) {
    this.oscConfig.getConfiguredMessage(oscMessage).then(
      function(message) {
        // build & send websocket message
        if (this.websocketTarget) {
          let websocketMessage = {
            address: message.message.address,
            config: message.config,
            data: message.message.args
          };
          this.websocketTarget.send(websocketMessage);
        }

        // build & send midi message
        if (true /*this.midiTarget*/) {
          let midiMessage = this.transformOscToMidi(message);
        }
      }.bind(this)
    );
  }

  transformOscToMidi(message) {
    // @todo handle multiple params
    let oscValue = message.message.args[0];
    // const rtpmidi = require("rtpmidi");
    // send to configured midi channel and controller
    let midiData = {
      controller: oscMessageConfig.midiController,
      value: midiValue,
      channel: oscMessageConfig.midiChannel
    };
    console.log("Send MIDI data", midiData);
    /*
    session.connect({ address: "10.10.1.202", port: 5004 });
    session.sendMessage(deltaTime, message);
*/
    //midiOutput.send("cc", midiData);
  }
}

/**
 * Convert and send an osc message to midi port
 */
/*
function convertAndEmitMidiMessage(oscMessage, oscMessageConfig) {
  let midiValue = oscMessage.args[0];
  // transform osc data if a transformFunction is provided in config
  if (
    oscMessageConfig.transformFunction &&
    typeof tf.transformFunctions[oscMessageConfig.transformFunction] != "undefined"
  ) {
    // collect params
    let params = {};
    let paramLabels = tf.transformFunctionParamLabels[oscMessageConfig.transformFunction];
    let paramValues = oscMessageConfig.transformFunctionParams;

    Object.keys(paramLabels).forEach(function(key, index) {
      params[key] = paramValues[index];
    });
    // apply transform function
    midiValue = tf.transformFunctions[oscMessageConfig.transformFunction](midiValue, params);
  }
  // send to configured midi channel and controller
  let midiData = {
    controller: oscMessageConfig.midiController,
    value: midiValue,
    channel: oscMessageConfig.midiChannel
  };
  console.log("Send MIDI data", midiData);
  midiOutput.send("cc", midiData);
}
*/
module.exports.OscServer = OscServer;
