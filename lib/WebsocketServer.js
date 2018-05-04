/**
 * Websocket server for communication with UI
 */
"use strict";

class WebsocketServer {
  constructor(port = 3000) {
    this.port = port;
    this.socket = null;
    // @todo: Setting
    this.serveClient = false;
    this.httpServer = require("http").createServer();
    let io = require("socket.io");

    // start websocket server
    console.log("Starting websocket server on port " + this.port);
    this.socketIo = io(this.httpServer, {
      serveClient: this.serveClient
    });
    this.httpServer.listen(this.port);

    this.socketIo.on("connection", this.onConnection.bind(this));
  }

  onConnection(socket) {
    console.log("Websocket connection established");
    this.socket = socket;
    // listen for messages
    // this.socket.on("saveOscConfig", saveOscConfig);
  }

  saveOscConfig() {
    // dependent to osc server
    console.log("Received saveOscConfig message");
  }
}

module.exports.WebsocketServer = WebsocketServer;
