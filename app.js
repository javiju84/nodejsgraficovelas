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
		if ( err ) throw Serr;
		var dayArray = [];
		var volumen = [];

		for (index in docs){
			var doc = docs[index];
			var x = doc["x"];
			var volume = doc["volume"];
			dayArray.push({"label": x});
			volumen.push({"value": volume});
		}

		var dataset = [
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