var mongoose    = require('mongoose');
var User        = mongoose.model('User');
var passport    = require('passport');
require('./passport-config');

var jwtTokenMiddleware = require('./jwt').jwtTokenMiddleware;

var express = require('express')
var router = express.Router()

/*---------------------------------------------------------------------------------------*/
/*                                      REGISTER                                         */
/*---------------------------------------------------------------------------------------*/

router.post('/register', function(req, res, next) {
  if(!req.body.username || !req.body.password)
    return res.status(400).json({message: 'Please fill out all fields'});

  passport.authenticate('local-signup', function(err, user, info) {
    if (err) return next(err);
    if (user)
      return res.json({ token: user.generateJWT() });
    else
      return res.status(401).json(info);
  })(req, res, next);
});

/*---------------------------------------------------------------------------------------*/
/*                                        LOGIN                                          */
/*---------------------------------------------------------------------------------------*/

router.post('/login', function(req, res, next) {
  if(!req.body.username || !req.body.password)
    return res.status(400).json({message: 'Please fill out all fields'});

  passport.authenticate('local-login', function(err, user, info) {
    if (err) return next(err);
    if (user)
      return res.json({ token: user.generateJWT() });
    else
      return res.status(401).json(info);
  })(req, res, next);
});

/*---------------------------------------------------------------------------------------*/
/*                                CONNECT USING FACEBOOK                                 */
/*---------------------------------------------------------------------------------------*/
/*router.get('/connect/facebook', passport.authenticate('facebook'));
router.get('/connect/facebook/callback', function(req, res, next) {
  passport.authenticate('facebook', function(err, user, info) {
    if (err) return next(err);
    
    if (user)
      return res.json({ token: user.generateJWT() });
    else
      return res.status(401).json(info);
  })(req, res, next);
});*/


/*---------------------------------------------------------------------------------------*/
/*                                    REMOVE ACCOUNT                                     */
/*---------------------------------------------------------------------------------------*/
router.get('/unregister', jwtTokenMiddleware, function(req, res) {
  var user            = req.user;
  user.remove();
});

/*---------------------------------------------------------------------------------------*/
/*                                       LIST                                            */
/*---------------------------------------------------------------------------------------*/
router.get('/list', jwtTokenMiddleware, function(req, res, next) {
  // Get a list of usernames and id's
  User
    .find()
    .select('local.username _id')
    .exec(
      function(err, users){
        if (err) { return next(err); }
        res.json(users);
      }
    );
});

router.get('/get/:foruser', jwtTokenMiddleware, function(req, res, next) {
  var id = req.params.foruser;
  if (id == 'self')
    id = req.user.id;
  User
    .findById(id)
    .select('-local.password -local.salt')
    .exec(
      function (err, foruser) {
        if (err) { return next(err); }
        if (!foruser) { return next(new Error('can\'t find foruser')); }

        res.json(foruser);
      }
    );
});

router.post('/query', jwtTokenMiddleware, function(req, res, next) {
  // Get a profile with a specific username
  var query = req.body.query;
  User
   .find({ 'local.username': new RegExp('^'+query+'$', "i") })
   .select('-local.password -local.salt -gifts')
   .exec(
      function(err, users){
        if (err) { return next(err); }
        res.json(users);
      }
    );
})

/*---------------------------------------------------------------------------------------*/
/*                                    LOGGED IN TEST                                     */
/*---------------------------------------------------------------------------------------*/
router.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0'); 
});

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

module.exports = router;