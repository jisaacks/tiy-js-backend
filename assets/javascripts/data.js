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

    initialize: function(data, opts) {
      this.list_id = opts.list_id;
    },

    url: function() {
      scope = $.param({scope: {list_id:this.list_id}});
      return "/todo_items?" + scope;
    }
  });

  ns.TodoList = Backbone.Model.extend({
    idAttribute:  "_id",
    urlRoot:      "/todo_lists",

    initialize: function() {
      if (!this.isNew()) {
        this.initItems();
      } else {
        this.once("change:_id", this.initItems, this);
      }
    },

    initItems: function() {
      this.items = new ns.TodoItems(null, {list_id: this.id});
      this.listenTo(this.items, "add", function(model, collection, options) {
        this.trigger("items:add", model, collection, options);
      });
      this.listenTo(this.items, "sync", function(synced, resp, options) {
        this.trigger("items:sync", synced, resp, options);
      });
      this.items.fetch();
    },

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
