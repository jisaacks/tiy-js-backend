(function(ns){

  ns.TodoItem = Backbone.Model.extend({
    idAttribute:  "_id",
    urlRoot:      "/todo_items",

    complete: function() {
      return !!this.get("completed_at");
    }
  });

  ns.TodoItems = Backbone.Collection.extend({
    model:        ns.TodoItem
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
