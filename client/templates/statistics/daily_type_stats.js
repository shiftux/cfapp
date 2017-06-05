Template.dailyTypeStats.onRendered( function(){

  // Get the context of the canvas element we want to select
  var ctx = $("#dailyTypeStats").get(0).getContext("2d");
  // ratio = ctx.canvas.width / ctx.canvas.height
  // ctx.canvas.width  = window.innerWidth * .75;
  // ctx.canvas.height = ctx.canvas.width / ratio * .7;

  var options = {
    animation:{
      animateRotation:true
    },
  };

  var data = {
    labels: this.data.dailyTypes,
    datasets: [
      {
        label: "Daily Users per Activity",
        data: this.data.dailyTypeStats,
        backgroundColor: [
          background_red,
          background_blue,
          background_yellow,
          background_turquoise,
          background_purple,
          background_orange,
          background_gray,
        ],
        borderColor: [
          border_red,
          border_blue,
          border_yellow,
          border_turquoise,
          border_purple,
          border_orange,
          border_gray,
        ],
        borderWidth: 1
      }
    ]
  };

  chartArea = this.$('#dailyTypeStats');
  DoughnutChart = new Chart(chartArea, {
    type: 'doughnut',
    data: data,
    options: options,
  })

});