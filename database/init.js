var mongoose    = require('mongoose');
var config = require('./config');

module.exports = function() {
    mongoose.connect(config.database);

    // Uncomment to drop database
    /*
    mongoose.connection.on('connected', function() {
        mongoose.connection.db.dropDatabase(function (err) {
            console.log('dropped collection %s, %s ', 'cadocom', err);
            mongoose.connection.close();
            process.exit(0);
        });
    });/**/

}