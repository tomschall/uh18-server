/* UH18 #shipbeat - OSC2MIDI
 *
 * This app listens to a UDP port for OSC messages.
 * The messages are forwarded via Websockets to the UI and,
 * if any configuration found for a OSC message in mongodb,
 * the messages are converted to MIDI and sent to a MIDI port.
 *
 * Usage:
 * Start application: `node server.js`
 *
 * @todo: Startup options:
 * e.g.: -p Specifies the UDP port to listen for OSC messages
 */

"use strict";

const wsServer = require("./lib/WebsocketServer");
const oscServer = require("./lib/OscServer");
const oscConfig = require("./lib/OscConfig");

new oscServer.OscServer({
  port: 57121,
  websocketServer: new wsServer.WebsocketServer(),
  configProvider: new oscConfig.OscConfig()
});
