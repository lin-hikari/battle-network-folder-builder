const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const folderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  chips: [
    {
      type: Schema.Types.ObjectId,
      ref: "Chip",
    },
  ],
});

module.exports = mongoose.model("Folder", folderSchema);
