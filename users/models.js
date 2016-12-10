var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('./jwt');

// set up a mongoose model
// this setup allows linking facebook, twitter and google accounts
var UserSchema = mongoose.Schema({
    local: {
        username:     String,
        password:     String,
        salt:         String
    },
    /*facebook: {
        id:           String,
        token:        String,
        name:         String
    },*/
    wishes: [{ type: Schema.Types.ObjectId, ref: 'Gift' }],
    gifts: [{ type: Schema.Types.ObjectId, ref: 'Gift' }],

});
 
UserSchema.methods.generateJWT = function() {
  return jwt.generateJWT(this);
};
 
UserSchema.methods.validPassword = function (password) {
  var password = crypto.pbkdf2Sync(password, this.local.salt, 1000, 64).toString('hex');
  return this.local.password === password;
};
 
UserSchema.methods.setPassword = function(password){
  this.local.salt = crypto.randomBytes(16).toString('hex');
  this.local.password = crypto.pbkdf2Sync(password, this.local.salt, 1000, 64).toString('hex');
};

mongoose.model('User', UserSchema);