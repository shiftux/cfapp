Template.dailyUserStats.onRendered( function(){

  // Get the context of the canvas element we want to select
  // var ctx = $("#dailyUserStats").get(0).getContext("2d");
  // ratio = ctx.canvas.width / ctx.canvas.height
  // ctx.canvas.width  = window.innerWidth * .75;
  // ctx.canvas.height = ctx.canvas.width / ratio * .7;

  var backgroundColorArray = new Array(this.data.days.length)
  var borderColorArray = new Array(this.data.days.length)
  backgroundColorArray.fill(background_gray)
  borderColorArray.fill(border_gray)
  backgroundColorArray[Math.floor(this.data.days.length/2)] = background_blue
  borderColorArray[Math.floor(this.data.days.length/2)] = border_blue

  var options = {
    scales: {
      xAxes: [{
        stacked: true
      }],
      yAxes: [{
        stacked: true
      }]
    }, 
    legend: {
        display: false
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  var data = {
    labels: this.data.days,
    datasets: [
      {
        // label: "Daily Users",
        data: this.data.dailyUserStats,
        borderColor: borderColorArray,
        backgroundColor: backgroundColorArray,
        borderWidth: 1
      }
    ]
  };

  chartArea = this.$('#dailyUserStats');
  BarChart = new Chart(chartArea, {
    type: 'bar',
    data: data,
    options: options,
  })

});