(function(ns){

  // -- SETUP PRIVATE METHODS -- //

  var attListeners,
      addList,
      delList,
      selList,
      addItem,
      delItem;

  // -- ATTACH LISTENERS -- //

  attListeners = function() {
    var lists, items, view;


    // Get local copies

    lists = this.lists;
    items = this.items;
    view  = this.view;

    // -- LISTEN TO LISTS COLLECTION -- //

    lists.on("sync", function() {

      // When the lists collection syncs with the server
      // It is no longer loading and we want to update the
      // list data with the newly synced data.

      view.setProps({
        listData: lists.toJSON(),
        listsLoading: false
      });

    });

    lists.on("destroy", function(destroyedList) {

      // When a list is destroyed we want to update
      // the list data (with the destroyed list removed)

      props = {
        listData: lists.toJSON()
      };

      // If the destroyed list was selected, we need to
      // unset the item data.

      if ( destroyedList.id === items.list_id ) {
        props.itemData = undefined;
      }

      view.setProps(props);
    });

    lists.on("add", function(newList) {

      // When a list is added we want to update
      // the list data (with the new list)

      view.setProps({listData: lists.toJSON()});

      // If the list is not persisted, save it.

      if ( newList.isNew() ) {
        newList.save();
      }

    });

    // -- LISTEN TO ITEM COLLECTION -- //

    items.on("request", function(requesting){

      // When the items collection makes a request to
      // the server, we want to update it to *loading*

      if (items === requesting) {
        view.setProps({itemsLoading: true});
      }

    });

    items.on("sync", function(synced){

      // When the items collection or a model in the
      // items collection syncs with the server we want
      // to update the item data with the newly synced
      // data.

      props = {
        itemData: items.toJSON()
      };

      // If the thing that has synced is indeed the
      // items collection and not one of it's models
      // We want to set `itemsLoading` to false

      if (items === synced) {
        props.itemsLoading = false;
      }

      view.setProps(props);
    });

    items.on("add", function(newItem) {

      // When an item is added we want to update
      // the item data (with the new item)

      view.setProps({ itemData: items.toJSON() });

      // If the item isnot persisted yet we also
      // want to save it. Additionally we will want
      // to set the list_id on the item to create
      // the relationship between the list and items

      if (newItem.isNew()){
        newItem.set("list_id", items.list_id);
        newItem.save();
      }

    });

    items.on("destroy", function() {

      // When an item is destroyed we want to update
      // the item data (with the destroyed item removed)

      view.setProps({ itemData: items.toJSON() });
    });
  }

  // -- ACTIONS -- //

  // Add a list

  addList = function(obj) {
    this.lists.add(obj);
  };

  // Delete a list

  delList = function(id) {
    this.lists.findWhere({_id: id}).destroy();
  };

  // Select a list

  selList = function(id) {

    // Set the selected list id on the items collection

    this.items.setListId(id);

    // Get the name of the selected list and set it
    // as a property on the view.

    var list = this.lists.findWhere({_id: id});
    this.view.setProps({selListName: list.get("name")});
  };

  // Add an items

  addItem = function(obj) {
    this.items.add(obj);
  };

  // Delete an item

  delItem = function(id) {
    this.items.findWhere({_id: id}).destroy();
  };

  // -- CONSTRUCTOR --//

  ns.App = function(opts) {

    // Initialize our lists collection

    this.lists = new ns.data.TodoLists();

    // Initialize our items collection
    // Note: We only need one because every
    // time a list is selected, we are resetting
    // our items collection. This allows us to
    // only need to attach listeners to only one
    // items collection and prevents storing too
    // many items in memory.

    this.items = new ns.data.TodoItems();

    // Tell react to render our root view into
    // the element that was passed in our opts

    this.view = React.render(
      <ns.views.Root
        addList={addList.bind(this)}
        delList={delList.bind(this)}
        selList={selList.bind(this)}
        addItem={addItem.bind(this)}
        delItem={delItem.bind(this)} />
      , opts.el
    );

    // Attach our listeners

    attListeners.call(this);

    // Fetch our lists

    this.lists.fetch();
  };

  ns.App.prototype = {

  }

})(tiy);
