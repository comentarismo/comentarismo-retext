var utils = require("../utils");
var twitter = require('twitter-text')

module.exports = function (app) {


    //find dates, times, phones, links, emails, places,
    app.all('/twitter/:type', utils.allowCrossDomain, function (req, res) {
        if (req.method === 'PUT' ||
            req.method === 'GET' ||
            req.method === 'DELETE' ||
            req.method === 'HEAD' ||
            req.method === 'TRACE' ||
            req.method === 'CONNECT') {
            console.log("twitter, Could not process METHOD :(", req.method);
            return res.status(422).send({error: "invalid_method"});
        }

        var track = req.body;
        var type = req.params.type;

        if (!track.text || !type) {
            console.log("syntax, Could not identify message, type -> ", type, track);
            return res.status(422).send({error: "invalid_message"});
        }
        // console.log('twitter called ...' + type);

        type = type.toLowerCase();


        // ================= // =================
        // ================= extracthashtags
        // ================= // =================
        if (type === "extracthashtags") {
            const result = twitter.extractHashtags(twitter.htmlEscape(track.text))
            return processResponse({extracthashtags: result});
        }

        // ================= // =================
        // ================= extractreplies
        // ================= // =================
        else if (type === "extractreplies") {
            const result = twitter.extractReplies(twitter.htmlEscape(track.text))
            return processResponse({extractreplies: [result]});
        }

        // ================= // =================
        // ================= extractmentions
        // ================= // =================
        else if (type === "extractmentions") {
            const result = twitter.extractMentions(twitter.htmlEscape(track.text));
            return processResponse({extractmentions: result});
        }

        // ================= // =================
        // ================= extractUrls
        // ================= // =================
        else if (type === "extracturls") {
            const result = twitter.extractUrls(twitter.htmlEscape(track.text))
            return processResponse({extracturls:result});
        }

        // ================= // =================
        // ================= extractCashtags
        // ================= // =================
        else if (type === "extractcashtags") {
            const result = twitter.extractCashtags(twitter.htmlEscape(track.text))
            return processResponse({extractcashtags:result});
        }

        else {
            console.log("/twitter, Could not identify message type :(", type);
            return res.status(422).send({error: "invalid_type"});
        }


        function processResponse(response) {
            return res.send(response);
        }

    });


}