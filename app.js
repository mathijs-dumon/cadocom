var express = require('express');
var app = express();

app.use(express.logger('dev'));
app.use("" + __dirname + "/dist");
app.listen(process.env.PORT || 5000);