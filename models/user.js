const mongoose = require("mongoose");

const {Schema} = mongoose;

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    lastActive: {
        type: Date
    },
    status: {
        type: String,
        enum: ["Online", "Offline"],
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
