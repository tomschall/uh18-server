const MIDI_MIN = 0;
const MIDI_MAX = 127;

// helper functions
const midiSanitize = value => {
  if (value < MIDI_MIN) value = MIDI_MIN;
  if (value > MIDI_MAX) value = MIDI_MAX;
  return Math.round(value);
};

// transform functions
module.exports.transformFunctions = {
  divideBy: (value, params) => {
    let quotient = 0;
    let divisor = params["Divisor"];
    // divide if divisor > 0
    if (divisor > 0) quotient = value / divisor;
    return midiSanitize(quotient);
  },
  fitIntoMidiRange: (value, params) => {
    let min = params["Min"];
    let max = params["Max"];

    if (value > max) value = max;
    if (value < min) value = min;
    // linear interpolation
    let result = (value - min) / (max - min) * (MIDI_MAX - MIDI_MIN) + MIDI_MIN;
    return midiSanitize(result);
  },
  multiplyBy: (value, params) => {
    let multiplier = params["Multiplier"];
    let result = value * multiplier;
    return midiSanitize(result);
  }
};

// @todo: to be used in frontend form generation
// form: functionName = {name: description}
module.exports.transformFunctionParamLabels = {
  divideBy: {
    Divisor: "Fixed divisor for OSC value"
  },
  fitIntoMidiRange: {
    Min: "Minimum expected value for OSC message",
    Max: "Maximum expected value for OSC message"
  },
  multiplyBy: {
    Multiplier: "Fixed multiplier for OSC value"
  }
};
