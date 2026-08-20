const mongoose = require("mongoose");
const {Schema} = mongoose;
const User = require("./user.js");

const roomSchema = new Schema({
    roomType: {
        type: String,
        enum: ["private", "group"],
        required: true,
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    lastActive: {
        type: Date,
        default: Date.now,
    },
    lastMessage: {
        type: String,
    },
    lastTime: {
        type: String,
    },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
