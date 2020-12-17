var express = require('express');
var bodyParser = require('body-parser');
var app = express();


var port = 8080;
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get('/api/users', function(req, res) {
var user_id = req.param('id');
var token = req.param('token');
var geo = req.param('geo'); 
res.send(user_id + ' ' + token + ' ' + geo);
});


app.post('/api/users', function(req, res) {
    var user_id = req.body.id;
    var token = req.body.token;
    var geo = req.body.geo;
    res.send(user_id + ' ' + token + ' ' + geo);
    });
    // start the server
    app.listen(port);
    console.log('Server started! At http://localhost:' + port);
    