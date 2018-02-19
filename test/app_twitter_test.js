var chai = require('chai');
var assert = chai.assert;
var should = chai.Should()

var request = require('supertest');

var Promise = require("bluebird");
Promise.promisifyAll(request, {multiArgs: true});

var utils = require("../utils");

const DEBUG_MODE_ON = /true/.test(process.env.DEBUG);

describe('Should process twitter text', function () {
    var server;
    beforeEach(function () {
        server = require('../app.js');
    });
    afterEach(function () {
        server.close();

    });

    var expected = {
        twitts: [
            "#hashtag Mentioning @twitter and @jack, #baby",
            "Message with hyphenated-url.com",
            "<a href=\"https://twitter.com\" target=\"_blank\">twitter & friends</a>",
            "&lt;a href=&quot;https://twitter.com&quot; target=&quot;_blank&quot;&gt;twitter &amp; friends&lt;/a&gt;",
            "@username reply @username2 reply2",
            "Example cashtags: $TEST $Stock   $symbol"
        ]
    };

    describe('POST twitts', function () {

        // ======= POST ======= extractHashtags //
        it('should return ok for a valid hit - extractHashtags', function (done) {
            this.timeout(10000);

            var target = {
                url: '/twitter/extractHashtags',
                method: 'POST',
                form: {text: expected.twitts[0]}
            };

            request(server).post(target.url).send(target.form).then(function (res) {
                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {
                    assert.deepEqual(syntax, {extracthashtags: ['hashtag', 'baby']});
                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= extractReplies //
        it('should return ok for a valid hit - extractReplies', function (done) {
            this.timeout(10000);

            var target = {
                url: '/twitter/extractreplies',
                method: 'POST',
                form: {text: expected.twitts[4]}
            };

            request(server).post(target.url).send(target.form).then(function (res) {
                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {
                    assert.deepEqual(syntax, {extractreplies: ['username']});
                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= extractMentions //
        it('should return ok for a valid hit - extractMentions', function (done) {
            this.timeout(10000);

            var target = {
                url: '/twitter/extractMentions',
                method: 'POST',
                form: {text: expected.twitts[0]}
            };

            request(server).post(target.url).send(target.form).then(function (res) {
                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {
                    assert.deepEqual(syntax, {extractmentions: ['twitter', 'jack']});
                    done();
                }


            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= extractUrls //
        it('should return ok for a valid hit - extractUrls', function (done) {
            this.timeout(10000);

            var target = {
                url: '/twitter/extractUrls',
                method: 'POST',
                form: {text: expected.twitts[1]}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {
                    assert.deepEqual(syntax, {extracturls: ['hyphenated-url.com']});
                    done();
                }


            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= extractcashtags //
        it('should return ok for a valid hit - extractcashtags', function (done) {
            this.timeout(10000);

            var target = {
                url: '/twitter/extractcashtags',
                method: 'POST',
                form: {text: expected.twitts[5]}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {
                    assert.deepEqual(syntax, {extractcashtags: ["TEST","Stock","symbol"]});
                    done();
                }


            }).catch(function (e) {
                done(e)
            });
        });

    });

});
