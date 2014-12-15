var express     = require("express");
var mincer      = require("mincer");
var Datastore   = require('nedb');
var bodyParser  = require('body-parser');

var app = express();
var env = new mincer.Environment();
var db  = new Datastore("records");

env.appendPath("assets/javascripts");
env.appendPath("assets/stylesheets");
env.appendPath("assets/images");

app.use("/assets", mincer.createServer(env));
app.use(bodyParser.json());
app.set('view engine', 'jade');

app.get("/", function(req, res) {
  res.render("index");
});

var restful = require("./restdb");
restful(app, db, "/things");

db.loadDatabase(function (err) {
  if (err) throw err;
  app.listen(8025);
});
