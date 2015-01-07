var express     = require("express");
var Mincer      = require("mincer");
var Datastore   = require('nedb');
var bodyParser  = require('body-parser');
var json_api    = require('json_api');

var env = require("./mincer-env");

var app = express();

Mincer.logger.use(console);

var createApi = function(url, path) {
  var db = new Datastore({
    filename: path,
    autoload: true
  });
  app.use(url, json_api(db));
}

app.use("/assets", Mincer.createServer(env));
app.use(bodyParser.json());

createApi("/todo_lists", "data/lists.nedb");
createApi("/todo_items", "data/items.nedb");

app.set('view engine', 'jade');

app.get("/", function(req, res) {
  res.render("index");
});

app.listen(process.env.PORT || 8025);
