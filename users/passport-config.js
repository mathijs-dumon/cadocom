var config = require('./config');

var mongoose = require('mongoose');
var passport = require('passport');

var User = mongoose.model('User');

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

/*---------------------------------------------------------------------------------------*/
/*                                     Serialization                                     */
/*---------------------------------------------------------------------------------------*/
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

/*---------------------------------------------------------------------------------------*/
/*                                     LocalStrategy                                     */
/*---------------------------------------------------------------------------------------*/
passport.use('local-login', new LocalStrategy({ passReqToCallback : true  }, 
  function(req, username, password, done) { 
    process.nextTick(function() {
      User.findOne({ 'local.username':  username }, function(err, user) {
          if (err) return done(err);
          if (!user)
            return done(null, false, { message: 'Incorrect username.' });
              
          if (!user.validPassword(password))
              return done(null, false, { message: 'Incorrect password.' });
          return done(null, user);
      });
    });
}));


var updateUser = function(user, username, password, done) {
  user.local.username = username;
  user.setPassword(password);

  user.save(function (err){
    if (err) return done(err);
    return done(null, user);
  });
}

passport.use('local-signup', new LocalStrategy({ passReqToCallback : true },
  function(req, username, password, done) {
    User.findOne({ 'local.username': username }, function(err, existingUser) {
        if (err) return done(err);
        if (existingUser) 
            return done(null, false, { message: 'That username is already taken.' });
        if (req.user)
            updateUser(req.user, username, password, done);
        else
            updateUser(new User(), username, password, done);
    });
  }
));

/*---------------------------------------------------------------------------------------*/
/*                                    FacebookStrategy                                   */
/*---------------------------------------------------------------------------------------*/

var updateFacebookUser = function(user, profile, token, done) {
  user.facebook.id    = profile.id; 
  user.facebook.token = token;
  user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;

  // save to database
  user.save(function(err) {
      if (err) return done(err);
      return done(null, user);
  });
}

passport.use(new FacebookStrategy({
    clientID        : config.facebookConnect.clientID,
    clientSecret    : config.facebookConnect.clientSecret,
    callbackURL     : config.facebookConnect.callbackURL,
    passReqToCallback : true
  }, function(req, token, refreshToken, profile, done) { // facebook will send back the token and profile
    // find the user in the database based on their facebook id
    User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
        if (err) // database error
            return done(err);
        else if (user) {
            return updateFacebookUser(user, profile, token, done); // existing user = update
        } else
            return updateFacebookUser(new User(), profile, token, done); // no user = create & link
    });
  }
));