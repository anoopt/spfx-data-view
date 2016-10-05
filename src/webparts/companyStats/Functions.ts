export default class Functions{

  public static renderEmployees(size: number, numberOfEmployees: number): void{
    ($ as any)('#employeescircle').circleProgress({
          value: numberOfEmployees / 1000,
          size: size,
          fill: {
            gradient: ["#336699", "#336699"]
          }
          }).on('circle-animation-progress', function(event, progress, stepValue) {
            $(this).find('strong').text(String(stepValue.toFixed(3)).substr(2));
      });
  }

  public static renderRevenue(revenueYear3: number, revenueYear2: number, revenueYear1: number): void{
      var canvas = <HTMLCanvasElement> $("#revenueChart").find('canvas').get(0);
      var ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
      var revenueChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: ["2014", "2015", "2016"],
              datasets: [{
                  label: 'in £ million',
                  data: [
                    revenueYear3,
                    revenueYear2,
                    revenueYear1
                  ],
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  xAxes: [{
                      stacked: true
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              }
          }
      });
  }

  public static renderSatisfaction(workSatisfactionRate: number,
                            colleagueSatisfactionRate: number,
                            funSatisfactionRate: number,
                            socialSatisfactionRate: number): void{

      var canvas = <HTMLCanvasElement> $("#satisfactionChart").find('canvas').get(0);
      var ctx = <CanvasRenderingContext2D> canvas.getContext("2d");

      var data = {
          labels: ["Work", "Colleagues", "Fun", "Social"],
          datasets: [
              {
                  label: "Satisfaction in %",
                  backgroundColor: "rgba(179,181,198,0.2)",
                  borderColor: "rgba(179,181,198,1)",
                  pointBackgroundColor: "rgba(179,181,198,1)",
                  pointBorderColor: "#fff",
                  pointHoverBackgroundColor: "#fff",
                  pointHoverBorderColor: "rgba(179,181,198,1)",
                  data:
                  [
                    workSatisfactionRate,
                    colleagueSatisfactionRate,
                    funSatisfactionRate,
                    socialSatisfactionRate
                  ]
              }
          ]
      };

      var satisfactionChart = new Chart(ctx, {
          type: 'radar',
          data: data
      });
  }

  public static renderDoughnut(doughnutData1: number,
                        doughnutData2: number,
                        doughnutData3: number): void{

      var canvas = <HTMLCanvasElement> $("#doughnutChart").find('canvas').get(0);
      var ctx = <CanvasRenderingContext2D> canvas.getContext("2d");

      var data = {
          labels: [
              "Red",
              "Blue",
              "Yellow"
          ],
          datasets: [
              {
                  data: [
                    doughnutData1,
                    doughnutData2,
                    doughnutData3
                  ],
                  backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                  ],
                  hoverBackgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                  ]
              }]
      };

      var doughnutChart = new Chart(ctx, {
          type: 'doughnut',
          data: data
      });
  }

  public static renderLineChart(
                shareprice2011:number,
                shareprice2012:number,
                shareprice2013:number,
                shareprice2014:number,
                shareprice2015:number,
                shareprice2016:number
                                ) : void{
      var canvas = <HTMLCanvasElement> $("#lineChart").find('canvas').get(0);
      var ctx = <CanvasRenderingContext2D> canvas.getContext("2d");

      var data = {
            labels: ["2011", "2012", "2013", "2014", "2015", "2016"],
            datasets: [
                {
                    label: "Our company share price",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [shareprice2011, shareprice2012, shareprice2013, shareprice2014, shareprice2015, shareprice2016],
                    spanGaps: false,
                }
            ]
        };

        var lineChart = new Chart(ctx, {
            type: 'line',
            data: data
        });
  }
}