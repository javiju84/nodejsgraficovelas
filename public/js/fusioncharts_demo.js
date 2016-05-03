var chartData;

$(function(){
	$.ajax({

		url: 'http://localhost:3300/informacion',
		type: 'GET',
		success : function(data){
			chartData = data;
			var template = Handlebars.compile($("#tabular-template").html());
			$("#table-location").html(template(data));

			var chartProperties = {
				"caption": "Daily Stock Price HRYS",
           		"subCaption": "Last 2 months",
            	"numberprefix": "$",
            	"pyaxisname": "Price",
            	"vyaxisname": "Volume (In Millions)",
            	"showVolumeChart": "0",
            	"theme": "fint"
			};

			var categoriesArray = [{
				"category" : data["categories"]
			}];

			var candlestickChart = new FusionCharts({
				type: 'candlestick',
				renderAt: 'chart-container',
				width: '1000',
   				height: '600',
   				dataFormat: 'json',
   				dataSource: {
   					chart: chartProperties,
   					categories: categoriesArray,
   					dataset: data["dataset"]
   				}
			});
			candlestickChart.render();

		}
	});

});