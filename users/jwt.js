var mongoose = require('mongoose');

var jwt = require('express-jwt');
var jsonwt = require('jsonwebtoken');
var secret = require('../database/config')['secret'];

var jwtService = {};

jwtService.jwt = jwt;
jwtService.auth = jwt({secret: secret, userProperty: 'payload'});
jwtService.generateJWT = function(user) {
    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jsonwt.sign({
        _id: user._id,
        username: user.local.username,
        exp: parseInt(exp.getTime() / 1000),
    }, secret);
};
jwtService.jwtTokenMiddleware = function(req, res, next) {

    // Check headers or url parameters or post parameters for token:
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        // verifies secret and checks exp
        jsonwt.verify(token, secret, function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                mongoose.model('User')
                  .findOne({ 'local.username': decoded.username })
                  .exec(function(err, user) {
                    req.user = user;
                    next();
                  });
            }
        });

    } else // if there is no token
        return res.status(401).json({ message: 'You\'re not authenticated' });
}

module.exports = jwtService;