const path = require("path");

const express = require("express");
const app = express();

app.use("/", (req, res)=>{
	res.sendFile(path.join(__dirname, './index.html'));
})

const HTTPServer = app.listen(30001, ()=>{
	console.log("Server is open at port:30001");
});


const wsModule = require('ws');

const webSocketServer = new wsModule.Server(
	{
		server: HTTPServer
	}
);


webSocketServer.on('connection', (ws, request)=>{
	const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
	
	console.log('new client[{$ip}] welcome from server');
	
	ws.on('message', (msg)=>{
		console.log('message from client[{$ip}] is : {$msg}');
		ws.send('message received from server');
	})
	
	ws.on('error', (error)=>{
		console.log('client[{$ip}] connection error occured : {$error}');
	})
	
	ws.on('close', ()=>{
		console.log('client[{$ip}] web socket closed');	
	})
	
});
