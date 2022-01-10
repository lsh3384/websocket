/* 웹소켓 */
const webSocket = new WebSocket("ws://192.168.1.127:8080");

webSocket.onopen = (ws) => {
  webSocket.send(JSON.stringify('Hello from client'));
};

webSocket.onmessage = function (event) {
  var svr_data = JSON.parse(event.data);
  console.log(svr_data);

  var chart_data = config.data.datasets[0].data;
  chart_data[svr_data.wearable_band_num - 1] = svr_data.data; // 서버에서 받은 데이터 추가
  console.log(chart_data[svr_data.wearable_band_num - 1]);

  myChart.update();
}

webSocket.onclose = function () {
  console.log("connection closed");
}

webSocket.onerror = function (event) {
  console.log(event);
}


/* 차트 영역 */
const ctx = document.getElementById('myChart');
var config = {
  type: 'bar',
  data: {
    labels: [1],
    datasets: [{
      label: 'Chart Number1',
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)'
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
        max: 9
      }
    }
  }
};

var myChart = new Chart(ctx, config);