var chai = require('chai');
var assert = chai.assert;
var should = chai.Should()

var request = require('supertest');

var Promise = require("bluebird");
Promise.promisifyAll(request, {multiArgs: true});

var utils = require("../utils");

const DEBUG_MODE_ON = /true/.test(process.env.DEBUG);

describe('Should process syntax post', function () {

    var server;
    beforeEach(function () {
        server = require('../app.js');
    });
    afterEach(function () {
        server.close();

    });


    var str = "The irritated dog chased the frightened little cat",
        expected = {
            nouns: ['dog', 'chased', 'little', 'cat'],
            verbs: ['dog', 'cat'],
            adjectives: ['irritated', 'frightened', 'little',],
            adverbs: ['little'],
            rest: ['The'],
        };

    describe('POST syntax', function () {


        it('should return ok for a valid hit - getPOS', function (done) {
            this.timeout(10000);

            var target = {
                url: '/syntax/getPOS',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.sameMembers(syntax.nouns, expected.nouns);
                    assert.sameMembers(syntax.verbs, expected.verbs);
                    assert.sameMembers(syntax.adjectives, expected.adjectives);
                    assert.sameMembers(syntax.adverbs, expected.adverbs);
                    assert.sameMembers(syntax.rest, expected.rest);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= GET ======= noun, verb, adjective, adverb //

        it('should return ok for a valid hit - getNouns', function (done) {
            this.timeout(10000);

            var target = {
                url: '/syntax/getNouns',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.sameMembers(syntax, expected.nouns);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        it('should return ok for a valid hit - getVerbs', function (done) {
            this.timeout(10000);

            var target = {
                url: '/syntax/getVerbs',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.sameMembers(syntax, expected.verbs);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        it('should return ok for a valid hit - getAdjectives', function (done) {
            this.timeout(10000);

            var target = {
                url: '/syntax/getAdjectives',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.sameMembers(syntax, expected.adjectives);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        it('should return ok for a valid hit - getAdverbs', function (done) {
            this.timeout(10000);

            var target = {
                url: '/syntax/getAdverbs',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.sameMembers(syntax, expected.adverbs);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= IS ======= noun, verb, adjective, adverb //

        it('should return ok for a valid hit - isNoun', function (done) {
            this.timeout(10000);

            var target = {
                url: '/syntax/isNoun',
                method: 'POST',
                form: {text: expected.nouns[0]}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.ok(syntax);
                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        it('should return ok for a valid hit - isVerb', function (done) {
            this.timeout(10000);

            var target = {
                url: '/syntax/isVerb',
                method: 'POST',
                form: {text: expected.verbs[0]}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.ok(syntax);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        it('should return ok for a valid hit - isAdjective', function (done) {
            this.timeout(10000);

            var target = {
                url: '/syntax/isAdjective',
                method: 'POST',
                form: {text: expected.adjectives[0]}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.ok(syntax);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        it('should return ok for a valid hit - isAdverb', function (done) {
            this.timeout(10000);

            var target = {
                url: '/syntax/isAdverb',
                method: 'POST',
                form: {text: expected.adverbs[0]}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.ok(syntax);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });


        // ======= LOOKUP ======= noun, verb, adjective, adverb //

        it('should return ok for a valid hit - lookupNoun', function (done) {
            this.timeout(10000);

            var target = {
                url: '/syntax/lookupNoun',
                method: 'POST',
                form: {text: expected.nouns[1]}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.equal(syntax.length, 1);
                    assert.equal(syntax[0].pos, 'n');
                    assert.equal(syntax[0].lemma, 'pursued');

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        it('should return ok for a valid hit - lookupVerb', function (done) {
            this.timeout(10000);

            var target = {
                url: '/syntax/lookupVerb',
                method: 'POST',
                form: {text: expected.verbs[0]}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.equal(syntax.length, 1);
                    assert.equal(syntax[0].pos, 'v');
                    assert.equal(syntax[0].lemma, 'chase');

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        it('should return ok for a valid hit - lookupAdjective', function (done) {
            this.timeout(10000);

            var target = {
                url: '/syntax/lookupAdjective',
                method: 'POST',
                form: {text: expected.adjectives[1]}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.equal(syntax.length, 2);
                    assert.equal(syntax[0].pos, 's');
                    assert.equal(syntax[0].lemma, 'frightened');
                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        it('should return ok for a valid hit - lookupAdverb', function (done) {
            this.timeout(10000);

            var target = {
                url: '/syntax/lookupAdverb',
                method: 'POST',
                form: {text: expected.adverbs[0]}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.equal(syntax.length, 1);
                    assert.equal(syntax[0].pos, 'r');
                    assert.equal(syntax[0].lemma, 'little');
                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });


    });

});
