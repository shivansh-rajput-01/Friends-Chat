const mongoose = require("mongoose");
const {Schema} = mongoose;
const Room = require("./room.js");
const User = require("./user.js");

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room",
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    //     required: true,
    // },
    // updatedAt: {
    //     type: Date,
    // }
}, {
    timestamps: true
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
