const User = require("../models/user.js");
const Room = require("../models/room.js");
const Message = require("../models/message.js");
const {displayTime, displayDate, compareDate} = require("../utils/timeDisplay.js");
const { encrypt, dcrypt } = require("../utils/encryption.js");

module.exports.createChatRoom = async(req, res) => {
    let {username, code} = req.body;
    if(!code){
        console.log(code);
        return res.redirect("/");
    }
    let type = "private";
    let user2 = await User.findOne({userName: username});
    if(!user2){
        return res.redirect("/");
    }
    let decryptedCode = dcrypt(code);
    let user1;
    user1 = await User.findOne({email: req.user.email});
    if(decryptedCode == user2._id){
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
    } else {
        let secCodes = user2.shareCode;
        let hasCode = secCodes.find(obj => obj.name == user1.userName);
        if(hasCode){
            if(hasCode.secretCode == code){
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
                await User.findByIdAndUpdate(user2._id, {
                    $pull: { shareCode: { secretCode: code } }
                });
                return res.redirect(`/chats/${newRoom._id}`);
            }
        }
    }
    return res.redirect("/");
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
    let rooms = await Room.find({members: userId}).populate("members").sort({lastTime: -1});
    let messages = await Message.find({room: id}).sort({createdAt: 1});
    let hasMessage = true;
    if(messages && messages.length == 0){
        hasMessage = false;
    }
    console.log(hasMessage);
    const serverCurrentTime = new Date().toISOString();
    res.render("chat.ejs", {user1, user2, roomId: id, messages, displayTime, rooms, user, serverCurrentTime, pageCss: "styles/chat.css", displayDate, compareDate, encrypt, hasMessage});
}
