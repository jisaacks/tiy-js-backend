(function(ns){

  ns.App = function(opts) {

    var lists = new ns.data.TodoLists();

    var getState = function() {
      return {
        lists: lists.toJSON()
      }
    };

    var Root = React.createClass({
      getInitialState: function() {
        return getState();
      },

      addList: function(obj) {
        lists.add(obj);
      },

      componentDidMount: function() {
        // When a _new_ model is added
        // to collection, save it.
        lists.on("add", function(model) {
          if (model.isNew()){
            model.save();
          }
          this.setState(getState());
        }, this);

        // When our collection syncs with
        // the server, update our state.
        lists.on("sync", function() {
          this.setState(getState());
        }, this);
      },

      componentWillUnmount: function() {
        lists.off();
      },

      render: function() {
        return (
          <div>
            <ns.views.Header />
            <div>
              <ns.views.TodoLists lists={this.state.lists} addList={this.addList} />
            </div>
            <ns.views.Footer />
          </div>
        )
      }
    });

    React.render(<Root />, opts.el);
    lists.fetch();
  };

  ns.App.prototype = {

  };

})(tiy);
