require('./models');

var passport    = require('passport');
require('./passport-config');

module.exports = function(app) {
    // Use the passport package in our application
    app.use(passport.initialize());
}