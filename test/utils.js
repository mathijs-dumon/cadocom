var request = require('request');

var utils = {
    testUser: {
        username: 'testUser',
        password: 'testPassword'
    }
};

utils.getRootUrl = function () {
    return "http://localhost:8081/"
};

utils.createTestUserAndLoginToApi = function(callback) {
    var url = utils.getRootUrl() + "api/users/register";

    request.post({url: url, body: utils.testUser, json: true}, function (err, resp, body) {
        callback(body.token, body.user);
    });
};

utils.clearTestUser = function() {
    var url = this.getRootUrl();
    request.post({url: url + "api/users/login", body: utils.testUser, json: true}, function (err, resp, body) {
        request.get({url: url + "api/users/unregister", json: true, headers:{'x-access-token': body.token}});
    });
};

module.exports = utils;