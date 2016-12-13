var request = require('request');
var testUtils = require('../utils');

var token, user, url, headers, response, results;

beforeEach(function () {
  url = testUtils.getRootUrl() + 'api/wishes/create';
});

describe('wishes.create.spec.js', function () {

    describe('when not authorized', function () {
        beforeEach(function (done) {
            request.post({url: url, json: true}, function (err, resp, body) {
                response = resp;
                done(err);
            });
        });

        it ('should not be authorized', function () {
            expect(response.statusCode).to.equal(401);
        });
    });

    describe('when authorized', function () {
        before(function (done) {
            testUtils.createTestUserAndLoginToApi(function (token, testUser) {
                user = testUser;
                token = token;
                headers = {'x-access-token': token};
                done();
            });
        });

        after(function (done) {
            testUtils.clearTestUser();
            done();
        });

        describe('when new wish created', function () {
            describe('public', function () {
                beforeEach(function () {
                    wish = {
                        title: 'This is a test wish',
                        link: 'www.test.com' 
                    };
                });

                beforeEach(function (done) {
                  request.post({url: url, headers: headers, body: wish, json: true}, function (err, resp, body) {
                      response = resp;
                      results = body;
                      done(err);
                  });
                });

                it('should respond with 201 (created)', function () {
                  expect(response.statusCode).to.equal(201);
                });

                it('should create new wish', function () {
                  expect(results.title).to.be.ok;
                  expect(results.link).to.be.ok;
                  expect(results._id).to.be.ok;
                });

                it('should have owner', function () {
                    expect(results.owner).to.be.ok;
                    expect(results.owner).to.equal(user._id);
                });
            });
        });
    });
});