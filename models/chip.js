const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chipSchema = new Schema({
  number: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  damage: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Chip", chipSchema);
