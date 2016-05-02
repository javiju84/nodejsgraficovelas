var express = require("express");

var mongodb = require("mongodb");

var dbHost = "mongodb://localhost:27017/velas";

var dbObject;

var MongoClient = mongodb.MongoClient;


MongoClient.connect(dbHost, function(err,db){
	if( err ) throw err;
	dbObject = db;
});

function getData(responseObj){
	dbObject.collection("precios").find({}).toArray(function(err, docs){
		if ( err ) throw err;
		var dayArray = [];
		var volumen = [];
		var abierto = [];
		var alto = [];
		var bajo = [];
		var cierre = [];

		for (index in docs){
			var doc = docs[index];
			var x = doc["x"];
			var open = doc["open"];
			var high = doc["high"];
			var low = doc["low"];
			var close = doc["close"];
			var volume = doc["volume"];
			dayArray.push({"label": x});
			abierto.push({"value": open});
			alto.push({"value": high});
			bajo.push({"value": low});
			cierre.push({"value":close});
			volumen.push({"value": volume});
		}

		var dataset = [
			{
				"seriesname" : "Open",
				"data" : abierto
			},
			{
				"seriesname" : "Alto",
				"data" : alto
			},
			{
				"seriesname" : "Bajo",
				"data" : bajo
			},
			{
				"seriesname" : "Cierre",
				"data" : cierre
			},
			{
				"seriesname" : "Volumen",
				"data" : volumen
			}
		];

		var response = {
			"dataset" : dataset,
			"categories" : dayArray
		};
		responseObj.json(response);
	});
}

var app = express();

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use("/public", express.static("public"));
app.get("/informacion", function(req, res){
	getData(res);
});
app.get("/", function(req,res){
	res.render("chart");
});

app.listen("3300", function(){
	console.log("Server up: localhost:3300")
})