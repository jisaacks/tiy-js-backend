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

    lists.on("sync", function(synced) {

      // When the lists collection syncs with the server
      // It is no longer loading and we want to update the
      // list data with the newly synced data.

      var props = {
        listData: lists.toJSON(),
        listsLoading: false
      };

      // If it was in fact the lists collection that synced
      // - and the list collection has at least one list
      // - and the items collection does not have a list id
      // Then we need to auto select the first list

      if ( lists === synced && !!lists.length && !items.hasListId() ) {

        // Grab the first list

        var list = lists.first();

        // Set the list ID on the items collection

        items.setListId(list.id);

        // Set the seleted list name

        props.selListName = list.get("name")

        // Even though the don't have any item data
        // If we don't set the property it won't render

        props.itemData = [];
      }

      view.setProps(props);
    });

    lists.on("destroy", function(destroyedList) {

      // When a list is destroyed we want to update
      // the list data (with the destroyed list removed)

      var props = {
        listData: lists.toJSON()
      };

      // If the destroyed list was selected, we need to
      // either auto select on of the remianing lists or
      // unset the item data and clear the items list ID.

      if ( destroyedList.id === items.getListId() ) {

        if ( !!lists.length ) {

          // Grab the first list

          var list = lists.first();

          // Set the list ID on the items collection

          items.setListId(list.id);

          // Set the seleted list name

          props.selListName = list.get("name")

          // Even though the don't have any item data
          // If we don't set the property it won't render

          props.itemData = [];

        } else {

          // The user deleted the last list and there is
          // no longer a list to auto select so we need to
          // reset the items

          // Set itemData to undefined so it goes back to
          // It's initial state

          props.itemData = undefined;

          // Clear the selected list name we well. It shouldn't
          // matter since the items list won't render anyways
          // but we will still do it for good measure.

          props.selListName = undefined;

          // We need to clear the list ID on the items collection

          items.clearListId();

        }

      }

      view.setProps(props);
    });

    lists.on("add", function(newList) {

      if ( newList.isNew() ) {

        // When adding a new list, we want to select it.

        view.setProps({
          listData: lists.toJSON(),
          selListName: newList.get("name")
        });

        // If the list is not persisted, save it.

        newList.save().then(function(){

          // We need to set the selected list id
          // to this list's ID. But we wont know
          // the ID until after it is saved.

          items.setListId(newList.id);
        });

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

      var props = {
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

      // We only need to do anything if the item is new
      // The only other time this event fires is when
      // items are added after a sync and we are already
      // handling that case in the `sync` handler.

      if ( newItem.isNew() ){

        // If the item is not persisted yet we will
        // want to save it. Additionally we will want
        // to set the list_id on the item to create
        // the relationship between the list and items

        newItem.set("list_id", items.list_id);
        newItem.save();

        // Additionally we will need to update
        // the item data (with the new item)

        view.setProps({ itemData: items.toJSON() });
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

  // Mark an item as finished

  finItem = function(id, isFinished) {
    var item = this.items.findWhere({_id: id});
    var value = isFinished ? new Date() : false;
    item.save( "completed_at", value );
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
        finItem={finItem.bind(this)}
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
