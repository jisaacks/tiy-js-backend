(function(ns){

  ns.Record = Backbone.Model.extend({
    urlRoot: "/records",
    idAttribute: "_id"
  });

  ns.Records = Backbone.Collection.extend({
    url: "/records",
    model: ns.Record
  });

})(tiy.data);
