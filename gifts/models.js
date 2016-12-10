var mongoose = require('mongoose');

var GiftSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String,
  owner: { type: Number, ref: 'User' },
  donor: { type: Number, ref: 'User' }
});

mongoose.model('Gift', GiftSchema);