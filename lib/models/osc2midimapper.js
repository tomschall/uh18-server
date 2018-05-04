const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

// Create a blueprint of the new Schema
const schema = new mongoose.Schema({
  oscDevice: { type: String, required: true, unique: true },
  midiChannel: { type: Number, required: true },
  midiController: { type: Number, required: true },
  transformFunction: { type: String, required: false },
  transformFunctionParams: []
});

/* Use the mongoose-unique-validator for unique values {unique: true} */
schema.plugin(mongooseUniqueValidator);

// Create the model and export it
module.exports = mongoose.model("Osc2MidiMapper", schema);
