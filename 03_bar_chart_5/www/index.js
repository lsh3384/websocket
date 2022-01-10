/* 웹소켓 */
const webSocket = new WebSocket("ws://localhost:8080/monitor");

webSocket.onopen = (ws)=>{
  webSocket.send(JSON.stringify('Hello from monitor'));
};

webSocket.onmessage = function (event) {
  var data = JSON.parse(event.data);
  console.log(data);

  config.data.datasets[0].data[data.wearable_band_num-1] = data.data; // 서버에서 받은 데이터 추가
  console.log(config.data.datasets[0].data[data.wearable_band_num-1]);

  myChart.update();
}

webSocket.onclose = function() {
  console.log("connection closed");
}

webSocket.onerror = function(event){
  console.log(event);
}


/* 차트 영역 */
const ctx = document.getElementById('myChart');
var config = {
  type: 'bar',
  data: {
      labels: [1, 2, 3, 4, 5],
      datasets: [{
          label: 'Chart Number1',
          data: [],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
      }]
  },
  options: {
      responsive: false,
      scales: {
          y: {
              beginAtZero: true,
              min: 0,
              max: 10

          }
      }
  }
};

var myChart = new Chart(ctx, config);