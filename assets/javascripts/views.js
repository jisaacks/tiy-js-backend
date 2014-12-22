(function(ns){

  ns.Record = Backbone.View.extend({

    template: JST["templates/record"],

    render: function() {
      this.$el.html( this.template(this.model.toJSON()) );
      return this;
    }

  });

  //------

  ns.Records = Backbone.View.extend({

    template: JST["templates/records"],

    initialize: function() {
      this.listenTo(this.collection, "sync", function(){
        this.render();
      });
    },

    render: function() {
      this.$el.html( this.template() );
      
      $ul = this.$("ul");
      this.collection.each(function(m){
        $ul.append(new ns.Record({model: m}).render().el);
      }, this);
    }

  });

})(tiy.views);
