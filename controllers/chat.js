const User = require("../models/user.js");
const Room = require("../models/room.js");
const Message = require("../models/message.js");
const {displayTime} = require("../utils/timeDisplay.js");

module.exports.createChatRoom = async(req, res) => {
    let {username} = req.body;
    let type = "private";
    let user2 = await User.findOne({userName: username});
    if(!user2){
        return res.redirect("/");
    }
    console.log(req.user.email);
    let user1 = await User.findOne({email: req.user.email});
    const existingRoom = await Room.findOne({
        roomType: "private",
        members: {$all: [user1._id, user2._id]}
    });
    if(existingRoom) return res.redirect(`/chats/${existingRoom._id}`);
    let newRoom = new Room({
        roomType: type,
        members: [user1._id, user2._id],
    });
    await newRoom.save();
    return res.redirect(`/chats/${newRoom._id}`);
}

module.exports.displayChat = async (req, res) => {
    let {id} = req.params;
    const room = await Room.findById(id).populate("members");
    let user1 = room.members[0];
    let user2 = room.members[1];
    let activeUser = await User.findOne({email: req.user.email});
    if(user2.userName == activeUser.userName){
        let temp = user1;
        user1 = user2;
        user2 = temp;
    }
    let user = await User.findOne({email: req.user.email});
    let userId = user._id;
    let rooms = await Room.find({members: userId}).populate("members");
    let messages = await Message.find({room: id}).sort({createdAt: 1});
    res.render("chat.ejs", {user1, user2, roomId: id, messages, displayTime, rooms, user});
}
