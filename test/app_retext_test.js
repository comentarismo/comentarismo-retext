var request = require('supertest');
var chai = require('chai');
var assert = chai.assert;
var should = chai.Should()

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

    var str = 'Hey guys, utilize a shorter word.';
    var expected = {
        equality: [{
            "messages": [{
                "reason": "`guys` may be insensitive, use `people`, `persons`, `folks` instead",
                "line": 1,
                "column": 5,
                "location": {
                    "start": {"line": 1, "column": 5, "offset": 4},
                    "end": {"line": 1, "column": 9, "offset": 8}
                },
                "ruleId": "gals-men"
            }]
        }]
        ,
        simplify: [{
            "messages": [{
                "reason": "Replace “utilize” with “use”",
                "line": 1,
                "column": 11,
                "location": {
                    "start": {"line": 1, "column": 11, "offset": 10},
                    "end": {"line": 1, "column": 18, "offset": 17}
                },
                "ruleId": "utilize"
            }]
        }]
    };

    describe('POST syntax', function () {


        // ======= POST ======= simplify //
        it('should return ok for a valid hit - simplify', function (done) {
            this.timeout(10000);
            var target = {
                url: '/retext/simplify',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {
                const syntax = res.body
                // res.should.have.property('statusCode', 200);
                // res.headers.should.have.property('content-length', '1024');

                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.sameDeepMembers(syntax, expected.simplify);

                    done();
                }
            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= equality //
        it('should return ok for a valid hit - equality', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/equality',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    assert.sameDeepMembers(syntax, expected.equality);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= overuse //
        it('should return ok for a valid hit - overuse', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/overuse',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.overuse);
                    res.status.should.equal(200);

                    done();
                }


            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= cliches //
        it('should return ok for a valid hit - cliches', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/cliches',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.cliches);
                    res.status.should.equal(200);
                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= usage //
        it('should return ok for a valid hit - usage', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/usage',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.cliches);
                    res.status.should.equal(200);
                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= contractions //
        it('should return ok for a valid hit - contractions', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/contractions',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.contractions);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= diacritics //
        it('should return ok for a valid hit - diacritics', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/diacritics',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.diacritics);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= dutch //
        it('should return ok for a valid hit - dutch', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/dutch',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.dutch);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= english //
        it('should return ok for a valid hit - english', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/english',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.english);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= emoji //
        it('should return ok for a valid hit - emoji', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/emoji',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.emoji);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= indefinite-article //
        it('should return ok for a valid hit - indefinite-article', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/indefinite-article',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.indefinite_article);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= keywords //
        it('should return ok for a valid hit - keywords', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/keywords',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.keywords);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= latin //
        it('should return ok for a valid hit - latin', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/latin',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.latin);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= passive //
        it('should return ok for a valid hit - passive', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/passive',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.passive);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= profanities //
        it('should return ok for a valid hit - profanities', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/profanities',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.profanities);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= readability //
        it('should return ok for a valid hit - readability', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/readability',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.readability);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= redundant-acronyms //
        it('should return ok for a valid hit - redundant-acronyms', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/redundant-acronyms',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.redundant_acronyms);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= repeated-words //
        it('should return ok for a valid hit - repeated-words', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/repeated-words',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {
                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.repeated_words);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= sentence-spacing //
        it('should return ok for a valid hit - sentence-spacing', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/sentence-spacing',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.sentence_spacing);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= sentiment //
        it('should return ok for a valid hit - sentiment', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/sentiment',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.sentiment);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= smartypants //
        it('should return ok for a valid hit - smartypants', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/smartypants',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.smartypants);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= spell-en-us //
        it('should return ok for a valid hit - spell-en-us', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/spell-en-us',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.spell);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= spell-en-gb //
        it('should return ok for a valid hit - spell-en-gb', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/spell-en-gb',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.spell);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= stringify //
        it('should return ok for a valid hit - stringify', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/stringify',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.stringify);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= syntax-mentions //
        it('should return ok for a valid hit - syntax-mentions', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/syntax-mentions',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.syntax_mentions);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

        // ======= POST ======= quotes //
        it('should return ok for a valid hit - quotes', function (done) {
            this.timeout(10000);

            var target = {
                url: '/retext/quotes',
                method: 'POST',
                form: {text: str}
            };

            request(server).post(target.url).send(target.form).then(function (res) {

                const syntax = res.body;
                if (!syntax || syntax.error) {
                    done(new Error(syntax.error));
                } else {

                    // assert.sameDeepMembers(syntax, expected.quotes);
                    res.status.should.equal(200);

                    done();
                }

            }).catch(function (e) {
                done(e)
            });
        });

    });

});
