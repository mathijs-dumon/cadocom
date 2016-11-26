var express = require('express');
var router = express.Router();

require('./models');
var mongoose = require('mongoose');
var Gift = mongoose.model('Gift');

router.get('/list', function(req, res, next) {
  Gift.find(function(err, gifts){
    if (err) { return next(err); }

    res.json(gifts);
  });
});

router.post('/create', function(req, res, next) {
  var gift = new Gift(req.body);

  gift.save(function(err, gift){
    if (err) { return next(err); }

    res.json(gift);
  });
});

router.param('gift', function(req, res, next, id) {
  var query = Gift.findById(id);

  query.exec(function (err, gift){
    if (err) { return next(err); }
    if (!gift) { return next(new Error('can\'t find gift')); }

    req.gift = gift;
    return next();
  });
});

router.get('/:gift', function(req, res) {
  res.json(req.gift);
});

module.exports = router;