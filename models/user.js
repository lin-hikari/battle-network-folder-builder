const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  folders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Folder",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
