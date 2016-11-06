"use strict"

var http = require('http');
var express = require('express');
var socketio = require('socket.io');
var fs = require('fs');
var Sync = require('./syncnode/SyncNodeServer.js');
var google = require('googleapis');
var util = require('util');

var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);


var config = JSON.parse(fs.readFileSync('../private/config.json'));


app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	//	res.header("Access-Control-Allow-Origin", "//www.example.com");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	next();
});




var syncServer = new Sync(io, { namespace: 'data', dataDirectory: '../private' });
app.use('/', express.static('client/'));


var youtube = google.youtube({
	version: 'v3',
	auth: config.google.apiKey
});
//var auth = Youtube.authenticate({
//	type: "key",
//	key: config.google.apiKey
//});



io.on('connection', (socket) => {
	socket.on('get video info', (item) => {	
		console.log('get video info:', item);

		youtube.search.list({
			part: 'id,snippet',
			q: item.id,
			maxResults: 1
		}, function(err, data) {
			if (err) {
		    	console.error('Error: ' + err);
		    }
		    if (data) {
		    	console.log(util.inspect(data, true, 5));
				item.info = {
					title: data.items[0].snippet.title,
					description: data.items[0].snippet.description 
				};
				io.emit('get video info result', item);
		    }	
		});
	});
});




var chokidar = require('chokidar');
/* For Debugging, send a signal when file changes */
chokidar.watch('./client', { depth: 99 }).on('change', (filePath) => {
	if(filePath.match(/\.js$/i) !== null 
		|| filePath.match(/\.html$/i) !== null 
		|| filePath.match(/\.css$/i) !== null
		) {
		console.log('file changed!', filePath);
		io.emit('reload');
	};
});




server.listen(process.env.PORT || 13379, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Sync Server listening at", addr.address + ":" + addr.port);
});

