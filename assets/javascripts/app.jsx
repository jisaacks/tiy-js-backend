(function(ns){

  ns.App = function(opts) {

    this.records = new ns.data.Records();

    var Records = ns.views.Records;

    this.records.fetch().then(function(){
      React.render(
        <Records records={this.records} />,
        opts.el[0]
      );
    }.bind(this));

  };

  ns.App.prototype = {

  };

})(tiy);
