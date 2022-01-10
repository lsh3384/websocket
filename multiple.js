const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const fs = require('fs');
const express = require('express');
const path = require('path');

// 타입 확인 함수
function getType(target) {
  return Object.prototype.toString.call(target).slice(8, -1);
}

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

// wss1.on('connection', function connection(ws) {
// 	console.log('wss1 connected');
// 	ws.on('message', function(data) {
// 		console.log(`data is ${data}`);
// 	});
// });

// wss1.on('connection', function connection(ws) {
// 	console.log('wss1 connected');
// 	ws.on('message', function(data) {
// 		console.log(`data is ${data}`);
// 		console.log(typeof data);
// 		console.log(Array.isArray(data));
// 		console.log(getType(data));

// 		if(getType(data === 'Uint8Array')) {
// 			var arr = [].slice.call(data);
// 			console.log(getType(arr));
// 			console.log(arr.length);
// 			for(var i = 0; i < arr.length; i++) {
// 				console.log(String.fromCharCode(arr[i]));
// 			}
// 		}
// 	});
// });

wss1.on('connection', function connection(ws) {
	console.log('wss1 connected');
	ws.on('message', function(data) {
		// JSON 형식으로 변환 
		try {
			data_server = JSON.parse(data);
		} catch{
			console.log('Json이 아닙니다.');
		}
	
		// 받은 데이터가 Array이면
		if(getType(data_server === 'Array')) {
			for(var i = 0; i < data_server.length; i++){
				console.log(data_server[i]);
			}
		} else {
			console.log(data_server);
		}

		// 받은 데이터가 String이면
		if(getType(data_server === 'String' || data_server === 'Hello')) {
			console.log(data_server);
			ws.send('world');
		}
	});
});

wss2.on('connection', function connection(ws) {
	console.log('wss2 connected');
	ws.on('message', function(data) {
		try {
			data_server = JSON.parse(data);
		} catch{
			console.log('Json이 아닙니다.');
		}
		console.log(getType(data_server));
		if(getType(data_server === 'Array')) {
			for(var i = 0; i < data_server.length; i++){
				console.log(data_server[i]);
			}
		} else {
			console.log(data_server);
		}
	});
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
	console.log('listening on port: 8080');
});