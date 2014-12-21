var express     = require("express");
var mincer      = require("mincer");
var Datastore   = require('nedb');
var bodyParser  = require('body-parser');
var json_api    = require('json_api');

var app = express();
var env = new mincer.Environment();
var db  = new Datastore("records.nedb");

env.appendPath("assets/javascripts");
env.appendPath("assets/stylesheets");
env.appendPath("assets/images");

app.use("/assets", mincer.createServer(env));
app.use(bodyParser.json());
app.use("/records", json_api(db));

app.set('view engine', 'jade');

app.get("/", function(req, res) {
  res.render("index");
});

db.loadDatabase(function (err) {
  if (err) throw err;
  app.listen(8025);
});
