/* 모듈 */
const WebSocket = require('ws');
const path = require('path');
const url = require('url');
const express = require('express');
const app = express();


/* 포트 설정 */
app.set('port', process.env.PORT || 8080);


/* 서버와 포트 연결 */
const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 서버 실행 중 ..')
});


/* 웹소켓 생성 */
const wss_monitor = new WebSocket.Server({ noServer: true });
const wss_iaq_sensor = new WebSocket.Server({ noServer: true });


/* Static 폴더 지정 */
app.use(express.static(path.join(__dirname, '/../www')));


/* 라우터 설정 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../www/index.html'));
});

app.get('/Aaa/aaa', (req, res) => {
  res.sendFile(path.join(__dirname + '/..' + '/www' + '/sensor.html'));
});


/* 404 에러처리 */
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 해당 주소가 없습니다.`);
  error.status = 404;
  next(error);
});


// 모니터 웹소켓
wss_monitor.on('connection', (ws, req) => { // Connection Generate
  ws.on('message', (message) => { // 클라이언트로부터 받은 메세지
    var data = JSON.parse(message);
    console.log(data);
  });

  ws.on('error', (err) => { // 에러처리
    console.error(err);
  });

  ws.on('close', () => { // 종료
    console.log('클라이언트 접속 해제');
    clearInterval(ws.interval);
  });

  const intervalObj = setInterval(() => { // 1초 주기로 10~20 정수 데이터 전송 
    var sensor_data = {
      wearable_band_num: 0,
      data: Math.floor(Math.random() * (9 - 0) + 0)
    }

    sensor_data.wearable_band_num = Math.floor(Math.random() * (6 - 1) + 1);
  
    ws.send(JSON.stringify(sensor_data));
  }, 1000);
});


// IAQ 웹소켓
wss_iaq_sensor.on('connection', (ws, req) => { // Connection Generate
  ws.on('message', (message) => { // 클라이언트로부터 받은 메세지
    var data = JSON.parse(message);
    console.log(data);
  });

  ws.on('error', (err) => { // 에러처리
    console.error(err);
  });

  ws.on('close', () => { // 종료
    console.log('클라이언트 접속 해제');
    clearInterval(ws.interval);
  });
});


// 웹소켓별 연결 처리(각 웹소켓 요청 주소에 따라서 처리)
server.on('upgrade', function upgrade(request, socket, head) {
  var pathname = url.parse(request.url).pathname;
  console.log(url.parse(request.url));
  console.log(url.parse(request.url).pathname);
 	if (pathname === '/monitor') {
 		console.log('/monitor');
		wss_monitor.handleUpgrade(request, socket, head, function done(ws) {
     			wss_monitor.emit('connection', ws, request);
   		});
	} else if (pathname === '/Aaa/aaa') {
		console.log('/Aaa/aaa');
	   	wss_iaq_sensor.handleUpgrade(request, socket, head, function done(ws) {
     			wss_iaq_sensor.emit('connection', ws, request);
   		});
	} else {
		socket.destroy();
	}
});