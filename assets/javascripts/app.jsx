(function(ns){

  ns.App = function(opts) {

    var lists = new ns.data.TodoLists();

    var selectedList;

    var getState = function() {
      if (!selectedList && lists.length) {
        selectedList = lists.first();
      }
      var items = selectedList && selectedList.items;

      return {
        lists: lists.toJSON(),
        items: items && items.toJSON(),
        name: selectedList && selectedList.get("name")
      }
    };

    var Root = React.createClass({
      getInitialState: function() {
        return getState();
      },

      redraw: function() {
        this.setState( getState() );
      },

      addList: function(obj) {
        selectedList = lists.add(obj);
      },

      delList: function(id) {
        var wasSelected = false;
        // Get the list to delete
        var list = lists.findWhere({_id: id});
        // Check if the list was selected
        if (list.id === selectedList.id) {
          wasSelected = true;
        }
        // delete the list
        list.destroy();
        // If the list was selected, reset selection.
        if (wasSelected) {
          selectedList = null;
        }
        // finally redraw
        this.redraw();
      },

      addItem: function(obj) {
        // First set the list id
        obj.list_id = selectedList.id;
        selectedList.items.add(obj);
      },

      delItem: function(id) {
        selectedList.items.findWhere({_id: id}).destroy();
        this.redraw();
      },

      selectList: function(id) {
        selectedList = lists.findWhere({_id: id});
        this.redraw();
      },

      componentDidMount: function() {
        // When a _new_ model is added
        // to collection, save it.
        lists.on("add items:add", function(model) {
          if (model.isNew()){
            model.save();
          }
          this.redraw();
        }, this);

        // When our collection syncs with
        // the server, update our state.
        lists.on("sync items:sync", this.redraw, this);
      },

      componentWillUnmount: function() {
        lists.off();
      },

      render: function() {
        return (
          <div>
            <ns.views.Header />
            <div>
              <ns.views.TodoLists
                lists={this.state.lists}
                addList={this.addList}
                delList={this.delList}
                selectList={this.selectList} />

              <ns.views.TodoItems
                items={this.state.items}
                addItem={this.addItem}
                delItem={this.delItem}
                name={this.state.name} />
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
