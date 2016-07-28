console.log('Loading Server');
var fs = require('fs');
var express = require('express');

//modules below are express middleware
var bodyParser = require('body-parser');
var logger = require('morgan');
var compression = require('compression');
var favicon = require('serve-favicon');
var _ = require('underscore');
var app = express();
var http = require('http').createServer(app);

//Server's IP address
app.set("ipaddr", "127.0.0.1");

//Server's port number
app.set("port", 8080);
//var server = http.createServer(function(request, response){
//    console.log('Connection');
//    response.writeHead(200, {'Content-Type': 'text/html'});
//    //response.write('hello world');
//    response.end();
//});
var io = require('socket.io').listen(http);
var mongoDao = require('./mongoDao');

var mysqlDao = require('./mysqlDao');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

//.use loads express middleware
app.use(bodyParser.json());

app.use(logger('dev'));

app.use(compression());

app.use(allowCrossDomain);

app.use('/', mongoDao);

app.use('/foo', mysqlDao);

var db = [
    { id:1, "panelHeading":"Foo", "panelBody":"All your base are belong to us!" },
    { id:2, "panelHeading":"Bar", "panelBody":"I can haz cheesburger?" },
    { id:3, "panelHeading":"Baz", "panelBody":"Hooked on phonics worked for me!" }
];


//traditional webserver stuff for serving static files
var WEB = __dirname + '/web';
app.use(favicon(WEB + '/favicon.ico'));
app.use(express.static(WEB));
app.get('*', function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(404).sendFile(WEB + '/404Error.png');
});


//var config = JSON.parse(fs.readFileSync("/dev/nodejs/resumeServer.json"));
var port = process.env.port || 8080;
//Start the http server at port and IP defined before
http.listen(app.get("port"), app.get("ipaddr"), function() {
    console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});
//var server = app.listen(port);
io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});
//http.listen(8080, function(){
//    console.log('listening on 8080');
//});
//Event listener for a newly connected client
//io.on('connection', function(socket){
//    console.log('a user connected');
//});
//server.listen(8080);
//
//io.listen(server);
////http.listen(8080, function(){
////    console.log('listening on 8080');
////});
//
//var server = http.createServer(function(request, response){
//    console.log('Connection');
//    response.writeHead(200, {'Content-Type': 'text/html'});
//    //response.write('hello world');
//    response.end();
//});
//var socket = io.listen(server);
//socket.set('origins', '*');
//socket.on('connection', function() {
//    console.log('mooo');
//});

function gracefullShutdown(){
    console.log('\nStarting Shutdown');
    server.close(function(){
        console.log("before end call");
        console.log('\nShutdown Complete');
    });
}

process.on('SIGTERM', function(){
    gracefullShutdown();
});

process.on('SIGINT', function(){
    gracefullShutdown();
});

console.log(`Listening on port ${port}`);