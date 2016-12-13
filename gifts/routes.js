var express = require('express');
var router = express.Router();

require('./models');
var mongoose = require('mongoose');
var Gift = mongoose.model('Gift');
var User = mongoose.model('User');

router.param('foruser', function(req, res, next, id) {
  if (id == 'self')
    id = req.user._id;
  User
    .findById(id)
    .select('local.username _id')
    .exec(
      function (err, foruser) {
        if (err) { return next(err); }
        if (!foruser) { return next(new Error('can\'t find foruser')); }

        req.foruser = foruser;
        return next();
      }
    );
});

router.param('gift', function(req, res, next, id) {
  var query = Gift.findById(id);

  query.exec(function (err, gift){
    if (err) { return next(err); }
    if (!gift) { return next(new Error('can\'t find gift')); }

    if (gift.owner && gift.owner.equals(req.user._id))
      delete gift.donor; // don't tell the user who's getting his wishes

    req.gift = gift;
    return next();
  });
});

// Create a new wish
router.post('/wishes/create', function(req, res, next) {
  var wish = new Gift(req.body);
  wish.owner = req.user._id;
  
  wish.save(function(err, wish){
    if (err) { return next(err); }

    res.status(201).json(wish);
  });
});

// Get another user's wishes
router.get('/wishes/list/:foruser', function(req, res, next) {
  Gift
    .find({ 'owner': req.foruser._id })
    .select(req.foruser._id.equals(req.user._id) ? '-donor -isDonated' : '')
    .exec(
      function(err, wishes){
        if (err) { return next(err); }
        res.json(wishes);
      }
    );
});

// Get a wish
router.get('/wishes/:gift', function(req, res) {
  res.json(req.gift);
});

// Donate a wish (makes it a gift)
router.get('/wishes/:gift/donate', function(req, res, next) {
  if (req.gift.owner.equals(req.user._id))
     return next(new Error('can\'t donate your own whish'));
  else {
    req.gift.donor = req.user._id;
    req.gift.save(function(err, wish){
      if (err) { return next(err); }
      res.json(wish);
    });
  }
});

// Delete a wish
router.get('/wishes/:gift/delete', function(req, res) {
  if (!req.gift.owner.equals(req.user._id))
    return res.json({ message: 'You can not delete another user\'s (id: '+req.gift.owner+') wish (your id is ' + req.user._id + ')!' });
  req.gift.remove();
  return res.json({ message: 'Successfully deleted wish.' });
});

// Undonate a wish (= remove a gift but keep the wish)
router.get('/gifts/:gift/undonate', function(req, res, next) {
  if (req.gift.owner.equals(req.user._id))
     return next(new Error('can\'t undonate your own whish'));
  else {
    req.gift.donor = undefined;
    req.gift.save(function(err, wish){
      if (err) { return next(err); }
      res.json(wish);
    });
  }
});

// List all gifts
router.get('/gifts/list', function(req, res, next) {
  Gift
    .find({ 'donor': req.user._id })
    .exec(
      function(err, gifts){
        if (err) { return next(err); }
        res.json(gifts);
      }
    );
});

// Get a single gift
router.get('/gifts/:gift', function(req, res) {
  res.json(req.gift);
});

module.exports = router;