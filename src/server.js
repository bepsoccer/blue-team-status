var express = require('express'),
  app = express(),
  port = process.env.PORT || 8443,
  bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require("./routes.js");
routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + " not found"})
});

app.listen(port);

console.log("Express server started on: " + port);