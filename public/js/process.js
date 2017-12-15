/*
* get currency data
*/
function getTicker(currency, level, element) {

  //URL variables
  var HREF = window.location.href;
  var URL = HREF + "getticker?view=" + currency + "&level=" + level;

  //get data
  httpData(URL,'GET',"", function(res){
    transformData(res, element);
  });
}


/*
* create a date string from array
*/
function createDateString(array) {

  //add properties if array node is empty
  if (!array[1]) {array[1] = "01";}
  if (!array[2]) {array[2] = "01";}
  if (!array[3]) {array[3] = "00";} else if (array[3] < 10) { array[3] = "0" + array[3];}
  if (!array[4]) {array[4] = "00";} else if (array[4] < 10) { array[4] = "0" + array[4];}
  if (!array[5]) {array[5] = "00";} else if (array[5] < 10) { array[5] = "0" + array[5];}

  //return string e.g. 2017-01-01T00:00:00
  return array[0] + "-" + (array[1] + 1) + "-" + array[2] + "T" + array[3] + ":" + array[4] + ":" + array[5];
}


/*
* transform data
*/
function transformData(data, element) {

  data = JSON.parse(data);
  //console.log('getTicker data: ', JSON.stringify(data));

  var transData = {
    title: (data.rows[0].key[0]).split("-").splice(0,2).join("-"),

    yAxis: {
      title: {
        text: (data.rows[0].key[0]).split("-").join(" ")
      }
    },
    series: [{
      name: 'High',
      color: 'rgb(37, 94, 179)',
      data: []
    }, {
      name: 'Low',
      color: 'darkgrey',
      data: []
    }, {
      name: 'Price',
      color: 'rgb(37, 94, 179)',
      data: []
    }]
  };

  data.rows.forEach(function(row){

    //make date objects
    var dateArr = [];
    for (var i = 1; i < row.key.length; i++) {
      dateArr.push((row.key[i]));
    }

    // fill transData categories
    var dateObj = new Date(createDateString(dateArr));
    var date = dateObj.getTime();
    //transData.xAxis.categories.push(dateObj);

    //fill transData series
    var AVG = (row.value.max + row.value.min) / 2;
    transData.series[2].data.push([date, parseFloat(AVG.toFixed(5))]);

    //only add to array when there's a difference

      transData.series[0].data.push([date, parseFloat(row.value.max.toFixed(5))]);
      transData.series[1].data.push([date, parseFloat(row.value.min.toFixed(5))]);
  });

  generateChart(transData, element);
}


/*
* create graph on page based on incoming element and data
*/
function generateChart(data, element){

  //create graph
  var chart = Highcharts.stockChart({
        chart: {
            renderTo: element,
            type: 'line',
            events: {
              load: function () {
                  // set up the updating of the chart each interval
                  setInterval(function () {
                      updateChart(data.yAxis.title.text, chart);
                  }, 30000);
              }
            }
        },
        rangeSelector : {
          inputEnabled:false
        },
        navigator: {
          series: {
            lineColor: 'red'
          }
        },
        exporting: {
          enabled: false
        },
        title: {
            text: data.title
        },

        yAxis: {
            title: {
                text: data.yAxis.title.text
            }
        },
        series: data.series
    });
}


/*
* Update chart with latest entry
*/
function updateChart(view, chart){

  var view = view.split(" ").splice(0,2).join("-")

  //URL variables
  var HREF = window.location.href;
  var URL = HREF + "getticker/latest?view=" + view;

  //get data
  httpData(URL,'GET',"", function(res){

    //parse data
    data = JSON.parse(res);

    //convert data
    var row = data.rows[0];

    //make date array
    var dateArr = [];
    for (var i = 1; i < row.key.length; i++) {
      dateArr.push((row.key[i]));
    }
    //create date object
    var dateObj = new Date(createDateString(dateArr));
    var date = dateObj.getTime();
    var val = parseFloat(row.value.max.toFixed(5))

    console.log('adding date and value:', date, val);
    chart.series[2].addPoint([date, val])

  });

}


/*
* Load when DOM is ready
*/
$(document).ready(function() {
    getTicker("BTC-EUR", 6, "graph1");
    getTicker("XRP-EUR", 6, "graph2");
    getTicker("DOGE-EUR", 6, "graph3");
    getTicker("RDD-EUR", 6, "graph4");
    getTicker("STRAT-EUR", 6, "graph5");
    getTicker("DGB-EUR", 6, "graph6");
});
