var DEBUG_MODE_ON = process.env.DEBUG || false;

var port = process.env.PORT || 3013;

var express = require('express'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    basicAuth = require('basic-auth-connect');

var app = express();

app.use(compress());
app.use(bodyParser());

// app.use(basicAuth('admin', 'g4'));

require('./app/routes')(app);
require('./app/syntax')(app);
require('./app/textinfo')(app);
require('./app/twitter')(app);
require('./app/retext')(app);

app.listen(port);
console.log('Express app started on port ' + port);
