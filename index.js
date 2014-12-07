var express = require("express");
var mincer  = require("mincer");

var app = express();
var env = new mincer.Environment();

env.appendPath("assets/javascripts");
env.appendPath("assets/stylesheets");
env.appendPath("assets/images");

app.use("/assets", mincer.createServer(env));
app.set('view engine', 'jade');

app.get("/", function(req, res) {
  res.render("index");
});

app.listen(8025);
