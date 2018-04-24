'use strict';

module.exports = function(app) {
	var controller = require('./controller.js');

	app.route('/bulb')
		.get(controller.list_bulbs);

	app.route('/team/:id')
		.get(controller.get_team)
		.post(controller.change_team_status);
};