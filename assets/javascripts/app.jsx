(function(ns){

  ns.App = function(opts) {

    var lists = new ns.data.TodoLists();
    var items = new ns.data.TodoItems();

    var view; // The Root react view

    lists.on("sync", function() {
      view.setProps({
        listData: lists.toJSON(),
        listsLoading: false
      });
    });

    lists.on("destroy", function(destroyedList) {
      props = {
        listData: lists.toJSON()
      };
      if (destroyedList.id === items.list_id) {
        props.itemData = undefined;
      }
      view.setProps(props);
    });

    lists.on("add", function(newList) {
      view.setProps({listData: lists.toJSON()});
      if (newList.isNew()) {
        newList.save();
      }
    });

    items.on("request", function(requesting){
      if (items === requesting) {
        view.setProps({itemsLoading: true});
      }
    });

    items.on("sync", function(synced){
      props = {
        itemData: items.toJSON()
      };
      if (items === synced) {
        props.itemsLoading = false;
      }
      view.setProps(props);
    });

    items.on("add", function(newItem) {
      view.setProps({itemData: items.toJSON()});
      if (newItem.isNew()){
        newItem.set("list_id", items.list_id);
        newItem.save();
      }
    });

    items.on("destroy", function() {
      view.setProps({itemData: items.toJSON()});
    });

    var addList = function(obj) {
      lists.add(obj);
    };

    var delList = function(id) {
      lists.findWhere({_id: id}).destroy();
    };

    var selList = function(id) {
      items.setListId(id);
      var list = lists.findWhere({_id: id});
      view.setProps({selListName: list.get("name")});
    }

    var addItem = function(obj) {
      items.add(obj);
    };

    var delItem = function(id) {
      items.findWhere({_id: id}).destroy();
    };

    this.view = view = React.render(
      <ns.views.Root
        addList={addList}
        delList={delList}
        selList={selList}
        addItem={addItem}
        delItem={delItem} />
      , opts.el
    );

    lists.fetch();
  };

  ns.App.prototype = {

  };

})(tiy);
