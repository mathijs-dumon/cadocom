var jwt = require('express-jwt');
var secret = require('../database/config')['secret'];

var jwtService = {};

jwtService.jwt = jwt;
jwtService.auth = jwt({secret: secret, userProperty: 'payload'});
jwtService.generateJWT = function(user) {
    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: user._id,
        username: user.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
}

module.exports = jwtService;