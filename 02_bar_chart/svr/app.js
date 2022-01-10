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
const wss_monitor = new WebSocket.Server({ server });


/* Static 폴더 지정 */
app.use(express.static(path.join(__dirname, '/../www')));


/* 라우터 설정 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../www/index.html'));
});

app.get('/Aaa/aaa', (req, res) => {
  res.sendFile(path.join(__dirname + '/../www/sensor.html'));
});


/* 404 에러처리 */
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 해당 주소가 없습니다.`);
  error.status = 404;
  next(error);
});


/* 모니터 웹소켓 */
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

  const intervalObj = setInterval(() => { // 1초 주기로 0~9 정수 데이터 전송 
    var sensor_data = {
      wearable_band_num: 1,
      data: Math.floor(Math.random() * 10)
    }
  
    ws.send(JSON.stringify(sensor_data));
  }, 1000);
});