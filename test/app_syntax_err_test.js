var chai = require('chai');
var assert = chai.assert;
var should = chai.Should()

var request = require('supertest');

var Promise = require("bluebird");
Promise.promisifyAll(request, {multiArgs: true});

var utils = require("../utils");

const DEBUG_MODE_ON = /true/.test(process.env.DEBUG);

describe('Should process syntax post - error scenarios', function () {

    var server;
    beforeEach(function () {
        server = require('../app.js');
    });
    afterEach(function () {
        server.close();

    });

    describe('POST syntax', function () {

        it('should return error for a invalid syntax hit', function (done) {
            this.timeout(10000);

            var target = {
                url: '/syntax/invalid',
                method: 'POST',
                form: {type:"",text: ""}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                    const track = res.body;
                    if (!track || track.error) {
                        done();
                    } else {
                        done(new Error("Should have returned error but not ?"));
                    }


            }).catch(function (e) {
                done(e)
            });
        });

        // ======= GET ======= noun, verb, adjective, adverb //


        // ======= IS ======= noun, verb, adjective, adverb //


        // ======= LOOKUP ======= noun, verb, adjective, adverb //


    });

});
