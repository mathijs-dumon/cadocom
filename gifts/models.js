var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GiftSchema = new Schema({
  title: String,
  description: String,
  link: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  donor: { type: Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('Gift', GiftSchema);