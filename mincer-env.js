var Mincer = require("mincer");

// Add JSX Engine to Mincer
require("mincer-jsx")(Mincer);

var env = new Mincer.Environment();

env.appendPath("assets/javascripts");
env.appendPath("assets/stylesheets");
env.appendPath("assets/images");
env.appendPath("assets/fonts");

module.exports = env;
