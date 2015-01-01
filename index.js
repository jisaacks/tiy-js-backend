var express     = require("express");
var mincer      = require("mincer");
var Datastore   = require('nedb');
var bodyParser  = require('body-parser');
var json_api    = require('json_api');

// Add JSX Engine to Mincer
require('mincer-jsx')(mincer);

var app = express();
var env = new mincer.Environment();

mincer.logger.use(console);

var createApi = function(url, path) {
  var db = new Datastore({
    filename: path,
    autoload: true
  });
  app.use(url, json_api(db));
}

env.appendPath("assets/javascripts");
env.appendPath("assets/stylesheets");
env.appendPath("assets/images");
env.appendPath("assets/fonts");

app.use("/assets", mincer.createServer(env));
app.use(bodyParser.json());

createApi("/todo_lists", "data/lists.nedb");
createApi("/todo_items", "data/items.nedb");

app.set('view engine', 'jade');

app.get("/", function(req, res) {
  res.render("index");
});

app.listen(8025);
