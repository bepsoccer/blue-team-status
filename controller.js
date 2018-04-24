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
			if (status === "up") {
				console.log("status of Team" + req.params.id + " is up.");
				res.json(bulb);
				
				//Set bulb color to blue
				lifx.setColor("id:d073d5"+bulb.id, "#09004D", 1.0, true, function(cb){
					console.log(cb);
				});
			}
			else if (status === "down") {
				console.log("status of Team" + req.params.id + " is down.");
				res.json(bulb);
				
				//pulse red and set bulb to red
				lifx.breatheEffect("id:d073d5"+bulb.id, "#FF0000", "#800000", 1, 20, true, true, 0.5, function(cb){
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