const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.login = async (req, res) => {
    let {userName, password} = req.body;
    let user = await User.findOne({userName});
    if(user){
        if(await bcrypt.compare(password, user.password)){
            const e = user.email;
            const data = jwt.sign({email: e}, "secret");
            res.cookie("user", data);
            return res.redirect("/");
        }
        return res.send("wrong username or password");
    }
    return res.send("wrong username or password");
}

module.exports.signup = async (req, res) => {
    let {userName, email, password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    let user1 = new User({userName, email, password: hash});
    await user1.save();
    const data = jwt.sign({email}, "secret");
    res.cookie("user", data);
    res.redirect("/");
}

module.exports.logout = (req, res) => {
    res.cookie("user", "");
    res.redirect("/");
}
