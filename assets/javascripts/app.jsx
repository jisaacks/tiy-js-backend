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
        lists.add(obj);
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
