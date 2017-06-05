Template.chartWorkouts.onRendered( function(){
    var list = this.data.workoutsList.fetch()
    // sort by date
    list.sort(function(a, b) {
        return a.date - b.date;
    });
    // get weights
    var weights = list.map(function(w) {return w.weight;});
    // get dates and format to "Nov'15"
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var dates = list.map(function(d) {
        return monthNames[d.date.getMonth()] + "\'" + d.date.getFullYear().toString().split("20")[1];
    });

    // Get the context of the canvas element we want to select
    // var ctx = document.getElementById("chartWorkouts").getContext("2d");
    var ctx = $("#chartWorkouts").get(0).getContext("2d");
    ratio = ctx.canvas.width / ctx.canvas.height
    ctx.canvas.width  = window.innerWidth * .9;
    ctx.canvas.height = ctx.canvas.width / ratio * .9;

    var options = {
      ///Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines : true,
      //String - Colour of the grid lines
      scaleGridLineColor : "rgba(0,0,0,.2)",
      //Number - Width of the grid lines
      scaleGridLineWidth : 1,
      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,
      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true,
      //Boolean - Whether the line is curved between points
      bezierCurve : false,
      //Number - Tension of the bezier curve between points
      bezierCurveTension : 0.4,
      //Boolean - Whether to show a dot for each point
      pointDot : true,
      //Number - Radius of each point dot in pixels
      pointDotRadius : 4,
      //Number - Pixel width of point dot stroke
      pointDotStrokeWidth : 1,
      //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
      pointHitDetectionRadius : 20,
      //Boolean - Whether to show a stroke for datasets
      datasetStroke : true,
      //Number - Pixel width of dataset stroke
      datasetStrokeWidth : 2,
      //Boolean - Whether to fill the dataset with a colour
      datasetFill : true,
      //String - A legend template
      //legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
  };

  var data = {
      labels: dates,
      datasets: [
      {
        label: "Workout progression",

        data: weights,

        fill: true,
        lineTension: 0.1,
        backgroundColor: cftb_green_light,
        borderColor: cftb_green,
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: cftb_green,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: cftb_green_light,
        pointHoverBorderColor: cftb_green,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
      }
    ]
  };

  var chartArea = this.$('#chartWorkouts');
  var LineChart = new Chart(chartArea, {
    type: 'line',
    data: data,
    options: options,
  })

});