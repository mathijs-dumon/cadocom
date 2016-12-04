var models = require('./models');

var passport    = require('passport');
require('./passport-config');

var express = require('express')
var router = express.Router()

/*---------------------------------------------------------------------------------------*/
/*                                      REGISTER                                         */
/*---------------------------------------------------------------------------------------*/
router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({
      succes: false,
      message: 'Please fill out all fields'
    });
  }

  var user = new models.User();

  user.username = req.body.username;
  user.setPassword(req.body.password);

  user.save(function (err){
    if (err) { return next(err); }

    return res.json({ token: user.generateJWT() })
  });
});

/*---------------------------------------------------------------------------------------*/
/*                                        LOGIN                                          */
/*---------------------------------------------------------------------------------------*/
router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }

    if (user) {
      return res.json({ token: user.generateJWT() });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

/*---------------------------------------------------------------------------------------*/
/*                                  LIST (for debugging)                                 */
/*---------------------------------------------------------------------------------------*/
/*router.get('/list', function(req, res, next){
  models.User.find(function(err, users){
    if (err) { return next(err); }
    res.json(users);
  });
});*/

/*---------------------------------------------------------------------------------------*/
/*                                    LOGGED IN TEST                                     */
/*---------------------------------------------------------------------------------------*/
router.get('/loggedin', function(req, res) {
  console.log(req.user);
  res.send(req.isAuthenticated() ? req.user : '0'); 
});

module.exports = router;