(function(ns){

  ns.App = function(opts) {

    var lists = new ns.data.TodoLists();
    var items = new ns.data.TodoItems();

    var Root = React.createClass({
      getInitialState: function() {
        return {
          listsLoading: true,
          itemsLoading: false,
          selectedList: null
        }
      },

      addList: function(obj) {
        lists.add(obj);
      },

      delList: function(id) {
        lists.findWhere({_id: id}).destroy();
      },

      addItem: function(obj) {
        items.add(obj);
      },

      delItem: function(id) {
        items.findWhere({_id: id}).destroy();
      },

      selectList: function(id) {
        items.setListId(id);

        this.setState({
          selectedList: lists.findWhere({_id: id})
        });
      },

      componentDidMount: function() {
        // When a _new_ model is added
        // to collection, save it.
        lists.on("add", function(model) {
          this.forceUpdate();
          if (model.isNew()){
            model.save();
          }
        }, this);

        items.on("add", function(model) {
          this.forceUpdate();
          if (model.isNew()){
            model.set("list_id", items.list_id);
            model.save();
          }
        }, this);

        lists.once("sync", function(){
          this.setState({listsLoading: false});
          lists.on("sync", function() {
            this.forceUpdate();
          }, this);
          lists.on("destroy", function(list) {
            if (list.id === this.state.selectedList.id) {
              this.setState({selectedList: false});
            } else {
              this.forceUpdate();
            }
          }, this);
        }, this);

        items.on("request", function(requesting){
          if (items === requesting) {
            this.setState({itemsLoading: true});
          }
        }, this);

        items.on("sync", function(synced){
          if (items === synced) {
            this.setState({itemsLoading: false});
          } else {
            this.forceUpdate();
          }
        }, this);

        items.on("destroy", function() {
          this.forceUpdate();
        }, this);

      },

      render: function() {
        var selList  = this.state.selectedList;
        var listData = lists.toJSON();
        var itemData = selList && items.toJSON();
        var listName = selList && selList.get("name");
        var content;

        if (this.state.listsLoading) {
          content = (
            <ns.views.Spinner className="large-spinner" />
          );
        } else {
          content = (
            <div>
              <div className="lists">
                <ns.views.TodoLists
                  lists={listData}
                  addList={this.addList}
                  delList={this.delList}
                  selList={this.selectList} />
              </div>

              <div className="items">
                <ns.views.TodoItems
                  items={itemData}
                  loading={this.state.itemsLoading}
                  addItem={this.addItem}
                  delItem={this.delItem}
                  name={listName} />
              </div>
            </div>
          );
        }

        return (
          <div>
            <ns.views.Header />
            <div id="content">{content}</div>
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
