var config = require('./config');
var models = require('./models');

var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

/*---------------------------------------------------------------------------------------*/
/*                                     LocalStrategy                                     */
/*---------------------------------------------------------------------------------------*/
passport.use('local-login', new LocalStrategy({ passReqToCallback : true  }, 
  function(req, username, password, done) { 
    process.nextTick(function() {
      models.User.findOne(function (err, res) {
        console.log(res);
      });
      models.User.findOne({ 'local.username':  username }, function(err, user) {
          if (err) return done(err);
          if (!user) {
            console.log(username + " " + user + " " + err);
            return done(null, false, { message: 'Incorrect username.' });
          }
              
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
    models.User.findOne({ 'local.username': username }, function(err, existingUser) {
        if (err) return done(err);
        if (existingUser) 
            return done(null, false, { message: 'That username is already taken.' });
        if (req.user)
            updateUser(req.user, username, password, done);
        else
            updateUser(new models.User(), username, password, done);
    });
  }
));

/*---------------------------------------------------------------------------------------*/
/*                                    FacebookStrategy                                   */
/*---------------------------------------------------------------------------------------*/

var linkFacebookToUser = function(user, profile, token, done) {
  user.facebook.id    = profile.id; 
  user.facebook.token = token;
  user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
  user.facebook.email = profile.emails[0].value;

  // save to database
  user.save(function(err) {
      if (err) return done(err);
      return done(null, user);
  });
}

passport.use(new FacebookStrategy({
    clientID        : config.facebookAuth.clientID,
    clientSecret    : config.facebookAuth.clientSecret,
    callbackURL     : config.facebookAuth.callbackURL,
    passReqToCallback : true
  }, function(req, token, refreshToken, profile, done) { // facebook will send back the token and profile
    // check if the user is already logged in
    if (!req.user) {
        // find the user in the database based on their facebook id
        models.User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
            if (err) // database error
                return done(err);
            else if (user) {
                // link got removed
                if (!user.facebook.token)
                    return linkFacebookToUser(user, profile, token, done);
                return done(null, user); // user found, return that user
            } else
                return linkFacebookToUser(new models.User(), profile, token, done); // no user = create & link
        });
    } else {
        // user exists and is logged in => link accounts
        return linkFacebookToUser(req.user, profile, token, done);
    }
  }
));