(function(ns){

  ns.Header = React.createClass({
    render: function() {
      return <h2>Do All The Things</h2>
    }
  });

  ns.Footer = React.createClass({
    msg: "An example todo app using Node.js, Backbone.js and React.js",
    render: function() {
      return <div>{this.msg}</div>
    }
  });

  ns.TodoList = React.createClass({
    render: function() {
      return <div>{this.props.model.name}</div>
    }
  });

  ns.TodoLists = React.createClass({
    getInitialState: function() {
      return {
        newListName: ""
      }
    },

    add: function(e) {
      e.preventDefault();
      this.props.addList({name: this.state.newListName});
      this.setState({newListName: ""});
    },

    newNameChange: function(e) {
      this.setState({
        newListName: e.target.value
      });
    },

    buildList: function() {
      return this.props.lists.map(function(list) {
        return <ns.TodoList model={list} />
      });
    },

    render: function() {
      return (
        <div>
          <h3>
            Things to Do
            <button className="show-add">+</button>
          </h3>
          <ul>{this.buildList()}</ul>
          <form className="add" onSubmit={this.add}>
            <input type="text" name="name"
              value={this.state.newListName}
              onChange={this.newNameChange} />
            <input type="submit" value="Add" />
          </form>
        </div>
      );
    }
  });

})(tiy.views);
