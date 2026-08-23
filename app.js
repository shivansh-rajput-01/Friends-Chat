require("dotenv").config();

const express = require("express");
const engine = require('ejs-mate');

const app = express();

const path = require("path");
const http = require("http");
const mongoose = require("mongoose");
const User = require("./models/user.js");
const Room = require("./models/room.js");
const Message = require("./models/message.js");
const ExpressError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/WrapAsync.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {displayTime, displayDate, compareDate} = require("./utils/timeDisplay.js");
const {isLoggedIn, isAuthorized} = require("./middleware.js");

const {Server} = require("socket.io");
const { login, signup, logout } = require("./controllers/user.js");
const { displayChat, createChatRoom } = require("./controllers/chat.js");
const { encrypt, getSecretCode } = require("./utils/encryption.js");
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(cookieParser());

async function main(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
    }catch(err){
        console.log("Failed to connect to database" , err);
    }
}

main()
  .then((res) => console.log(`connected to database ${res}`))
  .catch((err) => console.log(err));

const userSocketMap = new Map();
let disTimeOut = {};

io.on("connection", async (socket) => {
    console.log(`New user connected ${socket.id}`);

    socket.on("join_room", ({sender, room}) => {
        socket.join(room);
        socket.data.sender = sender;
        socket.data.room = room;
        console.log(`${socket.id} joined ${room}`);
    });

    socket.on("join_personal_room", async ({id}) => {
        console.log(`${socket.id} joined room ${id}`);
        if (!id) return;
        if (disTimeOut[id]) {
            clearTimeout(disTimeOut[id]);
            delete disTimeOut[id];
        }
        let user = await User.findById(id);
        const serverCurrentTime = new Date().toISOString();
        user.status = "Online";
        user.lastActive = serverCurrentTime;
        await user.save();

        socket.join(id);

        if (!userSocketMap.has(id)) {
            userSocketMap.set(id, new Set());
        }
        userSocketMap.get(id).add(socket.id);

        console.log(`User ${id} connected with socket ${socket.id}`);
        
        io.emit("user_status_changed", { id, status: "Online" });
    });

    socket.on("message", async({text, room, sender, receiver}) => {
        const message = new Message({
            sender: sender,
            content: text,
            room: room,
        });
        await message.save();
        let r = await Room.findById(room);
        r.lastMessage = text;
        r.lastTime = message.createdAt;
        await r.save();
        let time = displayTime(message.createdAt);
        io.to(room).emit("message", {text, sender, time});
        // tell receiver about new message in any room
        console.log(`receiver id : ${receiver}`);
        io.to(receiver).emit("message_received", {room, time, text});
        // tell sender about new message and update message at sender room list
        socket.emit("message_received", {room, time, text});
    });

    socket.on("typing", ({room}) => {
        socket.to(room).emit("typing");
    });

    socket.on("disconnecting", async () => {
        const serverCurrentTime = new Date().toISOString();
        let id;
        for(let room of socket.rooms){
            if (room !== socket.id) {
                if (userSocketMap.has(room)) {
                    id = room;
                }
            }
        }
        for (let room of socket.rooms) {
            if (room !== socket.id) {
                if (userSocketMap.has(room)) {
                    const userId = room;
                    const userSockets = userSocketMap.get(userId);
                    userSockets.delete(socket.id);
                    if (userSockets.size === 0) {
                        userSocketMap.delete(userId);

                        await User.findByIdAndUpdate(userId, {
                            status: "Offline",
                            lastActive: serverCurrentTime
                        });

                        console.log(`User ${userId} is now truly Offline`);
                    }
                } 
                else {
                    socket.to(room).emit("going_offline", { serverCurrentTime, room, id });
                    clearTimeout(disTimeOut[id]);
                    disTimeOut[id] = setTimeout(async () => {
                        const user = await User.findById(id);
                        if(user.status == "Online"){
                            io.emit("user_status_changed", { id, status: "Online" });
                        }
                    }, 20000);
                }
            }
        }
    });
});

app.get("/", isLoggedIn, wrapAsync(async (req, res) => {
    let user = await User.findOne({email: req.user.email});
    let userId = user._id;
    let rooms = await Room.find({members: userId}).populate("members").sort({lastTime: -1});
    const serverCurrentTime = new Date().toISOString();
    res.render("main.ejs", {email: req.user.email, rooms, user, displayTime, userId, serverCurrentTime, pageCss: "styles/main.css", displayDate, compareDate, encrypt});
}));

app.post("/", isLoggedIn, wrapAsync(createChatRoom));

app.get("/chats/:id", isLoggedIn, wrapAsync(isAuthorized), wrapAsync(displayChat));

app.get("/code", isLoggedIn, wrapAsync(async (req, res) => {
    let {u} = req.query;
    try{
        const user = await User.findOne({userName: u});
        const currUser = await User.findOne({email: req.user.email});
        if(!user){
            return res.status(404).json({error: "user not found"});
        }
        const isEntry = await User.findOne({
            _id: currUser._id,
            "shareCode.name": u
        });
        let secretCode;
        if(!isEntry){
            secretCode = getSecretCode(currUser._id, user.userName);
            await User.findByIdAndUpdate(currUser._id, {
                $push: {
                    shareCode: {
                        name: u,
                        secretCode
                    }
                }
            });
        } else{
            let foundUser = isEntry.shareCode.find(user => user.name == u);
            secretCode = foundUser.secretCode;
        }
        res.json({success: true, code: secretCode});
    } catch(err){
        console.log(err);
        return res.status(500).json({error: "internal server error"});
    }
}));

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", wrapAsync(login));

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

app.post("/signup", wrapAsync(signup));

app.get("/logout", logout);

app.use((req, res, next) => {
    next(new ExpressError(400, `Bad request page not found ${req.path} ${req.method}`));
});

app.use((err, req, res, next) => {
    let {status = 500, message = "something went wrong"} = err;
    res.status(status).render("Error.ejs", {message});
});

server.listen(port, () => {
    console.log(`Server listening to port ${port}`);
});
