var express = require('express');
var bodyParser = require('body-parser');
var resourceRouter = require('./routes/resource');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// in case authentication was needed.
app.use('/api',function(req, res, next) {
    next();
});

app.use('/api/resource', resourceRouter);

app.listen(8080,'0.0.0.0');

module.exports = app;


