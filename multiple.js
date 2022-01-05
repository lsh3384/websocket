const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const fs = require('fs');
const express = require('express');
const path = require('path');

var app = express();

app.set('port', process.env.PORT || 8080);

app.use(express.static(path.join(__dirname, "public")));

app.get('/foo', function(req, res){
	res.sendFile(path.join(__dirname, './public/foo.html'));
});

app.get('/bar', function(req, res){
	res.sendFile(path.join(__dirname, './public/bar.html'))
});

const server = http.createServer(app);
const wss1 = new WebSocket.Server({ noServer: true });
const wss2 = new WebSocket.Server({ noServer: true });

wss1.on('connection', function connection(ws) {
	console.log('wss1 connected');
});

wss2.on('connection', function connection(ws) {
  	console.log('wss2 connected');
});

server.on('upgrade', function upgrade(request, socket, head) {
  var pathname = url.parse(request.url).pathname;
	console.log(pathname);
 	if (pathname === '/foo') {
 		console.log('/foo');
		wss1.handleUpgrade(request, socket, head, function done(ws) {
     			wss1.emit('connection', ws, request);
   		});
	} else if (pathname === '/bar') {
		console.log('/bar');
	   	wss2.handleUpgrade(request, socket, head, function done(ws) {
     			wss2.emit('connection', ws, request);
   		});
	} else {
		socket.destroy();
	}
});

server.listen(8080, function() {
	console.log('listening on http://127.0.0.1:8080');
});
