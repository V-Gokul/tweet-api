const db = require("../db")

async function isLoggedIn(req,res,next) {
    req.user = req.session.user;
    if (req.user) {
        next();
        return;
    }
    
    res.status(401).send({ code:401,message: "user Authentication failed"});
}

module.exports = {isLoggedIn}