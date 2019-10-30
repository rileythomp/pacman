'use strict'

var express = require('express');
var app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/views'));

app.listen(PORT, () => {
    console.log('Running on port ' + PORT);
});
