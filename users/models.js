var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('./jwt');

// set up a mongoose model
var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: String
});
 
UserSchema.methods.generateJWT = function() {
  return jwt.generateJWT(this);
};
 
UserSchema.methods.validPassword = function (password) {
  var password = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.password === password;
};
 
UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

mongoose.model('User', UserSchema);

module.exports = {
  'User': mongoose.model('User')
};