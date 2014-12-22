(function(ns){

  ns.App = function(opts) {

    this.records = new ns.data.Records();
    this.recordsView = new ns.views.Records({collection: this.records, el:opts.el});

    this.records.fetch();
  };

  ns.App.prototype = {

  };

})(tiy);
