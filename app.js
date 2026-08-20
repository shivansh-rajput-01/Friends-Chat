require("dotenv").config();

const express = require("express");

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
const {displayTime} = require("./utils/timeDisplay.js");
const {isLoggedIn, isAuthorized} = require("./middleware.js");

const {Server} = require("socket.io");
const { login, signup, logout } = require("./controllers/user.js");
const { displayChat, createChatRoom } = require("./controllers/chat.js");
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

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

main();

io.on("connection", wrapAsync(async (socket) => {
    console.log(`New user connected ${socket.id}`);

    socket.on("join_room", ({sender, room}) => {
        socket.join(room);
        socket.data.sender = sender;
        socket.data.room = room;
        console.log(`${socket.id} joined ${room}`);
    });

    socket.on("message", async({text, room, sender}) => {
        const message = new Message({
            sender: sender,
            content: text,
            room: room,
        });
        await message.save();
        let r = await Room.findById(room);
        r.lastMessage = text;
        r.lastTime = message.createdAt.toString().split(" ")[4].slice(0,5);
        await r.save();
        let time = message.createdAt.toString().split(" ")[4].slice(0,5);
        time = displayTime(time);
        io.to(room).emit("message", {text, sender, time});
    });

    socket.on("typing", ({room}) => {
        socket.to(room).emit("typing");
    });
}));

app.get("/", isLoggedIn, wrapAsync(async (req, res) => {
    let user = await User.findOne({email: req.user.email});
    let userId = user._id;
    let rooms = await Room.find({members: userId}).populate("members");
    res.render("main.ejs", {email: req.user.email, rooms, user, displayTime});
}));

app.post("/", isLoggedIn, wrapAsync(createChatRoom));

app.get("/chats/:id", isLoggedIn, wrapAsync(isAuthorized), wrapAsync(displayChat));

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
    next(new ExpressError(400, "Bad request page not found"));
});

app.use((err, req, res, next) => {
    let {status = 500, message = "something went wrong"} = err;
    res.status(status).render("Error.ejs", {message});
});

server.listen(port, () => {
    console.log(`Server listening to port ${port}`);
});
