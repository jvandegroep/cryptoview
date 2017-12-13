// check characters with library
function getTicker(currency, level, element) {

  //URL variables
  var HREF = window.location.href;



  //create URL
  var URL = HREF + "getticker?view=" + currency + "&level=" + level;

  //load dictionary file
  httpData(URL,'GET',"", function(res){
    generateChart(res, element);
  });
}


function generateChart(data, element){

  data = JSON.parse(data);
  console.log('highchart data: ', data);

  var chart = Highcharts.stockChart({
        chart: {
            renderTo: element,
            type: 'line'
        },
        title: {
            text: data.rows[0].key[0]
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
    });
}




// Load when document is ready
$(document).ready(function() {
    getTicker("BTC-EUR", 5, "demo");
});
