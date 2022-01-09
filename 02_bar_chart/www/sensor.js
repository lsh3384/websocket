const webSocket = new WebSocket("ws://localhost:8080/Aaa/aaa");
	
webSocket.onopen = (ws)=>{
  webSocket.send(JSON.stringify('Hello from sensor web socket'));
};

webSocket.onmessage = function (event) {
  console.log(event.data)
}

webSocket.onclose = function() {
  console.log("connection closed");
}

webSocket.onerror = function(event){
  console.log(event);
}

// 센서값 서버로 데이터 보내는 영역
