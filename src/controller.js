"use strict";

var settings = require('./settings.json');
var lifxObj = require('lifx-api');

exports.list_bulbs = function(req, res) {
	res.json(settings.bulb);
};

exports.change_team_status = function(req, res) {
	var bulb = settings.bulb.find(o => o.team == req.params.id);
	if (bulb == null) {
		res.status(404).send({"error": req.params.id + " is an invalid team id"});
	}
	else {
		var lifx = new lifxObj(bulb.token);
		try {
			var status = req.body.status.toLowerCase();
			bulb.status = status;
			var selector = "id:d073d5"+bulb.id;
			
			if (status === "up") {
				console.log("status of Team" + req.params.id + " is up.");
				res.json(bulb);
				
				//Set bulb color to blue
				lifx.setColor(selector, "#09004D", 1.0, true, function(cb){
					console.log(cb);
				});
			}
			else if (status === "down") {
				console.log("status of Team" + req.params.id + " is down.");
				res.json(bulb);
				
				//pulse red and set bulb to red
				lifx.breatheEffect(selector, "#FF0000", "#800000", 1, 20, true, true, 0.5, function(cb){
					console.log(cb);
				});
			}
			else {
				console.log("invalid status sent");
				res.status(404).send({"error": status + " is an invalid status"})
			}
		}
		catch(error) {
			res.status(404).send({"error": error});
		}
	}
};

exports.get_team = function(req, res) {
	var bulb = settings.bulb.find(o => o.team == req.params.id);
	res.json(bulb);
};

exports.demo_status = function(req, res) {
	var lifx = new lifxObj(settings.bulb[0].token);
	var selector = "group:HTTF";
	try {
		var status = req.body.status.toLowerCase();
		switch(status) {
			case "up":
				console.log("status of all Teams is "+ status);
				res.json(settings.bulb);
				
				//Set all bulbs' color to blue
				lifx.setColor(selector, "#09004D", 1.0, true, function(cb){
					console.log(cb);
				});
				break;
			case "down":
				console.log("status of all Teams is "+ status);
				res.json(settings.bulb);
				
				//Pulse red and set bulbs to red
				lifx.breatheEffect(selector, "#FF0000", "#800000", 1, 20, true, true, 0.5, function(cb){
					console.log(cb);
				});
				break;
			case "on":
				console.log("status of all Teams is "+ status);
				res.json(settings.bulb);

				//Set all bulbs' state to on and dim white
				lifx.setColor(selector, "kelvin:6000 brightness:0.08", 1.0, true, function(cb){
					console.log(cb);
				});
				break;
			case "off":
				console.log("status of all Teams is "+ status);
				res.json(settings.bulb);

				//Turn all bulbs off
				lifx.setPower(selector, "off", 1.0, function(cb){
					console.log(cb);
				});
				break;
			default:
				console.log("invalid status sent: \"" + status + "\"");
				res.status(404).send({"error": status + " is an invalid status"})
		}
	}
	catch(error) {
		res.status(404).send({"error": error});
	}
};