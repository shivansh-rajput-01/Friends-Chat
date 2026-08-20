const jwt = require("jsonwebtoken");
const Room = require("./models/room");

module.exports.isLoggedIn = function (req, res, next){
    // check if user is not set means no login
    if(!req.cookies.user){
        return res.redirect("/login");
    }
    // check if user is set and it a valid value
    try{
        const data = jwt.verify(req.cookies.user, "secret");
        if(!data) return res.redirect("/login"); // when logout data becomes empty string
        req.user = data;
        next();
    } catch(err){
        console.log(err);
        return res.redirect("/login");
    }
}

module.exports.isAuthorized = async function (req, res, next){
    let {id} = req.params;
    let room = await Room.findById(id).populate("members");
    if(room.roomType == "private"){
        if(req.user.email != room.members[0].email && req.user.email != room.members[1].email){
            return res.redirect("/");
        }
    }
    next();
}
