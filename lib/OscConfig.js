/**
 * OSC config to persist and read message configs
 *
 */
"use strict";

class OscConfig {
  constructor() {
    this._mongoose = require("mongoose");
    this._model = require("./models/osc2midimapper.js");
    this._mongoose.connect("mongodb://localhost:27017/uh-18");
    this._mongoose.connection.on("error", function(err) {
      console.log("Mongoose default connection error: " + err);
    });
    this._mongoose.connection.on("connected", function() {
      console.log("Mongoose default connection established");
    });
  }

  async getConfiguredMessage(message) {
    let config = await this._model.findOne({ oscDevice: message.address }).exec();
    return { message: message, config: config };
  }
}

module.exports.OscConfig = OscConfig;
