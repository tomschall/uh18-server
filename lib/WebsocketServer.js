/**
 * Websocket server for communication with UI
 */
"use strict";

class WebsocketServer {
  constructor(port = 3000) {
    this.port = port;
    this._socket = null;
    // @todo: Setting
    this.serveClient = false;
    let io = require("socket.io");

    // start websocket server
    console.log("Starting websocket server on port " + this.port);
    this.httpServer = require("http").createServer();
    this._socketIo = io(this.httpServer, { serveClient: this.serveClient });
    this._socketIo.on("connection", this.onConnection.bind(this));
    this.httpServer.listen(this.port);
  }

  get socket() {
    return this._socket;
  }

  onConnection(socket) {
    console.log("Websocket connection established");
    this._socket = socket;
    // listen for messages
    // this.socket.on("saveOscConfig", saveOscConfig);
  }

  saveOscConfig() {
    // dependent to osc server
    console.log("Received saveOscConfig message");
  }

  send(message) {
    if (this._socket) {
      this._socket.emit("oscMessage", message);
    }
  }
}

module.exports.WebsocketServer = WebsocketServer;
