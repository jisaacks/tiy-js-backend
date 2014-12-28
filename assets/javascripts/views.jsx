(function(ns){

  ns.Header = React.createClass({
    render: function() {
      return <h2>Do All The Things</h2>
    }
  });

  //--

  ns.Footer = React.createClass({
    msg: "An example todo app using Node.js, Backbone.js and React.js",
    render: function() {
      return <div>{this.msg}</div>
    }
  });

  //--

  ns.TodoList = React.createClass({
    render: function() {
      return <div onClick={this.props.onClick}>{this.props.model.name}</div>
    }
  });

  //--

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
      var selectList = this.props.selectList;
      var select = function(id) {
        return function() {
          selectList(id);
        }
      };

      return this.props.lists.map(function(list) {
        return <ns.TodoList
          model={list}
          key={"list_"+list._id}
          onClick={select(list._id)} />
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

  //--

  ns.TodoItem = React.createClass({
    del: function() {
      var confrimed = confirm("Delete " + this.props.item.name + "?");
      if (confrimed) {
        this.props.delItem(this.props.item._id);
      }
    },

    render: function() {
      return (
        <tr>
          <td width="60%">{this.props.item.name}</td>
          <td>
            <label>
              <input type="checkbox" />
              Finished
            </label>
          </td>
          <td><button onClick={this.del}>Delete</button></td>
        </tr>
      );
    }
  });

  //--

  ns.TodoItems = React.createClass({
    getInitialState: function() {
      return {
        newItemName: ""
      }
    },

    add: function(e) {
      e.preventDefault();
      this.props.addItem({name: this.state.newItemName});
      this.setState({newItemName: ""});
    },

    newNameChange: function(e) {
      this.setState({
        newItemName: e.target.value
      });
    },

    buildList: function() {
      var _this = this;
      if (this.props.items.length) {
        return this.props.items.map(function(item) {
          return <ns.TodoItem
            item={item}
            key={"item_"+item._id}
            delItem={_this.props.delItem} />
        });
      } else {
        return <tr><td colSpan="3">Relax!</td></tr>
      }
    },

    render: function() {
      if (this.props.items) {
        return (
          <div>
            <div className="util">
              <button>Delete {this.props.name}</button>
            </div>
            <h1>
              {this.props.name}
              <button className="show-add">+</button>
            </h1>
            <form className="add" onSubmit={this.add}>
              <input type="text" name="name"
                value={this.state.newItemName}
                onChange={this.newNameChange} />
              <input type="submit" value="Add" />
            </form>
            <table>
              <tbody>{this.buildList()}</tbody>
            </table>
          </div>
        );
      } else {
        return <div>Nothing to show here!</div>
      }
    }
  });

})(tiy.views);
