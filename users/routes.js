var express = require('express')

var router = express.Router()

/*// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})*/

/*---------------------------------------------------------------------------------------*/
/*                                 Utility functions                                     */
/*---------------------------------------------------------------------------------------*/
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

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

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

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

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({ token: user.generateJWT() });
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;