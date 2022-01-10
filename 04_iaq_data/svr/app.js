/* 모듈 */
const WebSocket = require('ws');
const path = require('path');
const url = require('url');
const express = require('express');
const app = express();
var qs = require('querystring');


/* 포트 설정 */
app.set('port', process.env.PORT || 8083);


/* 서버와 포트 연결 */
const server = app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 서버 실행 중 ..')
});


/* 웹소켓 생성 */
const wss_monitor = new WebSocket.Server({ server });


/* Static 폴더 지정 */
app.use(express.static(path.join(__dirname, '/../www')));


/* 데이터 저장 전역 변수 */
var data_from_iaq = {
  temp_c: null,
  humi: null,
  co_2: null,
  tvoc: null
}


/* 라우터 설정 */
app.get('/', (req, res) => {
});

app.post('/Aaa/a(a)?a', (req, res) => {
  console.log('\n', '\n', '/Aaa/a(a)?a');

  var body = "";
  req.on('data', function (data) {
    body = JSON.parse(data);
  });
  req.on('end', function () {
    try {
      console.log('type: ', body['type']);
    }
    catch (error) {
      console.log(body);
    }

    if (body['type'] === 'IAQ') {
      console.log(body);
      try {
        data_from_iaq.temp_c = body['devices'][0]['temp_c'];
        data_from_iaq.humi = body['devices'][0]['humi'];
        data_from_iaq.co_2 = body['devices'][0]['co_2'];
        data_from_iaq.tvoc = body['devices'][0]['tvoc'];

        console.log('-----------------------------------------------------------------');
        console.log('tvoc: ', body['devices'][0]['tvoc'], 'humi: ', body['devices'][0]['humi'], 'co_2: ', body['devices'][0]['co_2'], 'temp_c: ', body['devices'][0]['temp_c']);
        console.log('-----------------------------------------------------------------');
        if (web_socket !== null) {
          console.log('data??');
          web_socket.send(JSON.stringify(body));
          web_socket.send(JSON.stringify(data_from_iaq));
          console.log('data sent');
        } else {
          console.log(web_socket);
        }
      } catch (error) {
        console.log('error');
        console.log(error);
      }
    }
  });
  res.writeHead(200);
  res.end("Success");
});

app.post('/Bbb/b(b)?b', (req, res) => {
  console.log('\n', '\n', '/Bbb/b(b)?b');

  var body = "";
  req.on('data', function (data) {
    body = JSON.parse(data);
  });
  req.on('end', function () {
    try {
      console.log('type: ', body['type']);
    }
    catch (error) {
      console.log(body);
    }

    if (body['type'] === 'IAQ') {
      console.log(body);
      try {
        data_from_iaq.temp_c = body['devices'][0]['temp_c'];
        data_from_iaq.humi = body['devices'][0]['humi'];
        data_from_iaq.co_2 = body['devices'][0]['co_2'];
        data_from_iaq.tvoc = body['devices'][0]['tvoc'];

        console.log('-----------------------------------------------------------------');
        console.log('tvoc: ', body['devices'][0]['tvoc'], 'humi: ', body['devices'][0]['humi'], 'co_2: ', body['devices'][0]['co_2'], 'temp_c: ', body['devices'][0]['temp_c']);
        console.log('-----------------------------------------------------------------');
        if (web_socket !== null) {
          console.log('data??');
          web_socket.send(JSON.stringify(body));
          web_socket.send(JSON.stringify(data_from_iaq));
          console.log('data sent');
        } else {
          console.log(web_socket);
        }
      } catch (error) {
        console.log('error');
        console.log(error);
      }
    }
  });
  res.writeHead(200);
  res.end("Success");
});


/* 404 에러처리 */
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 해당 주소가 없습니다.`);
  error.status = 404;
  next(error);
});


var web_socket = null;

/* 모니터 웹소켓 */
wss_monitor.on('connection', (ws, req) => { // Connection Generate
  web_socket = ws;
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

  // const intervalObj = setInterval(() => { // 1초 주기로 0~9 정수 데이터 전송 
  //   var sensor_data = {
  //     wearable_band_num: 1,
  //     data: Math.floor(Math.random() * 10)
  //   }

  //   web_socket.send(JSON.stringify(sensor_data));
  // }, 1000);
});