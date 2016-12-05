var models = require('./models');

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
/*                                       CONNECT                                         */
/*---------------------------------------------------------------------------------------*/
router.post('/connect/local', passport.authenticate('local-signup'));
router.get('/unlink/local', function(req, res) {
  var user            = req.user;
  user.local.username = undefined;
  user.local.password = undefined;
  user.save();
});

router.get('/auth/facebook', jwtTokenMiddleware, passport.authenticate('facebook', { scope : 'email' }));
router.get('/auth/facebook/callback', jwtTokenMiddleware, passport.authenticate('facebook'));

router.get('/connect/facebook', jwtTokenMiddleware, passport.authorize('facebook', { scope : 'email' }));
router.get('/connect/facebook/callback', jwtTokenMiddleware, passport.authorize('facebook'));

router.get('/unlink/facebook', jwtTokenMiddleware, function(req, res) {
  var user            = req.user;
  user.facebook.token = undefined;
  user.save();
});

/*---------------------------------------------------------------------------------------*/
/*                                  LIST (for debugging)                                 */
/*---------------------------------------------------------------------------------------*/
router.get('/list', function(req, res, next){
  models.User.find(function(err, users){
    if (err) { return next(err); }
    res.json(users);
  });
});

/*---------------------------------------------------------------------------------------*/
/*                                    LOGGED IN TEST                                     */
/*---------------------------------------------------------------------------------------*/
router.get('/loggedin', function(req, res) {
  console.log(req.user);
  res.send(req.isAuthenticated() ? req.user : '0'); 
});

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

module.exports = router;