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
router.get('/unlink', jwtTokenMiddleware, function(req, res) {
  var user            = req.user;
  user.remove();
});

/*---------------------------------------------------------------------------------------*/
/*                                  LIST (for debugging)                                 */
/*---------------------------------------------------------------------------------------*/
/*router.get('/list', function(req, res, next){
  User.find(function(err, users){
    if (err) { return next(err); }
    res.json(users);
  });
});*/

/*---------------------------------------------------------------------------------------*/
/*                               Get profile information                                 */
/*---------------------------------------------------------------------------------------*/
router.get('/profile', function(req, res, next) {
  Gift.find(function(err, gifts){
    if (err) { return next(err); }
    res.json(req.user);
  });
});

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