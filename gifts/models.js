var mongoose = require('mongoose');

var GiftSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
});

mongoose.model('Gift', GiftSchema);