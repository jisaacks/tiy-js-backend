express = require "express"
Mincer  = require "mincer"
hamlc   = require "haml-coffee"
fs      = require "fs"
nconf   = require "nconf"
_       = require "underscore"
request = require "request"

nconf.env().argv()

@app = express()
@app.set "views", __dirname + "/views"
@app.set "view engine", "hamlc"
@app.engine '.hamlc', hamlc.__express

mincer = new Mincer.Environment()
mincer.appendPath __dirname + "/assets/js"
mincer.appendPath __dirname + "/assets/css"
mincer.appendPath __dirname + "/assets/images"

@app.use('/assets', Mincer.createServer(mincer))

@app.get "/", (req, res) =>
  res.render "app"

start_server = (port) =>
  @app.listen port
  console.log "Listening on port #{port}"

start_server nconf.get("port") || 8025
