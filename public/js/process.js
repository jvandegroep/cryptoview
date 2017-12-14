// get currency data
function getTicker(currency, level, element) {

  //URL variables
  var HREF = window.location.href;

  //create URL
  var URL = HREF + "getticker?view=" + currency + "&level=" + level;

  //get data
  httpData(URL,'GET',"", function(res){
    transformData(res, element);
  });
}

// transform data
function transformData(data, element) {

  data = JSON.parse(data);
  console.log('getTicker data: ', JSON.stringify(data));

  var transData = {
    title: (data.rows[0].key[0]).split("-").splice(0,2).join("-"),
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: (data.rows[0].key[0]).split("-").join(" ")
      }
    },
    series: [{
      data: []
    }]
  };


  data.rows.forEach(function(row){

    //make date objects and fill transData object
    var dateArr = [];
    for (var i = 1; i < row.key.length; i++) {
      dateArr.push((row.key[i]).toString());
    }
    console.log(dateArr);
    var dateObj = new Date(dateArr);
    console.log(dateObj);
    var date = dateObj.toLocalString();
    transData.xAxis.categories.push(date);


    //make value and fill transData object
    var AVG = (row.value.max + row.value.min) / 2;


  });

  generateChart(transData, element);
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
            text: data.title
        },
        xAxis: {
            categories: data.xAxis.categories
        },
        yAxis: {
            title: {
                text: data.yAxis.title.text
            }
        },
        series: data.series
    });
}




// Load when document is ready
$(document).ready(function() {
    getTicker("BTC-EUR", 5, "demo");
});
