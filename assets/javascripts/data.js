(function(ns){

  ns.TodoItem = Backbone.Model.extend({
    idAttribute:  "_id",
    urlRoot:      "/todo_items",

    complete: function() {
      return !!this.get("completed_at");
    }
  });

  ns.TodoItems = Backbone.Collection.extend({
    model:        ns.TodoItem,

    // Todo items should be scope to the selected
    // todo list.
    setListId: function(id) {
      if (this.list_id !== id) {
        this.list_id = id;
        // When we change which todo list we
        // are scoped to. We need to clear our
        // items and resync with the server.
        this.reset([]);
        this.fetch();
      }
    },

    url: function() {
      scope = $.param({scope: {list_id:this.list_id}});
      return "/todo_items?" + scope;
    }
  });

  ns.TodoList = Backbone.Model.extend({
    idAttribute:  "_id",
    urlRoot:      "/todo_lists",

    complete: function() {
      return _.every(this.items.invoke("complete"));
    }
  });

  ns.TodoLists = Backbone.Collection.extend({
    url:          "/todo_lists",
    model:        ns.TodoList,
    comparator:   "name"
  });

})(tiy.data);
