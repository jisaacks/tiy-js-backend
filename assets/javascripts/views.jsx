(function(ns){

  ns.Header = React.createClass({
    render: function() {
      return <div id="header"><h2>Do All The Things</h2></div>
    }
  });

  //--

  ns.Footer = React.createClass({
    msg: "An example todo app using Node.js, Backbone.js and React.js",
    render: function() {
      return <div id="footer">{this.msg}</div>
    }
  });

  //--

  ns.Spinner = React.createClass({
    render: function() {
      return <div className={this.props.className}><i className="fa fa-spin fa-spinner" /></div>
    }
  });

  ns.DelBtn = React.createClass({
    render: function() {
      return (
        <button className="del-btn" onClick={this.props.onClick}>
          <i className="fa fa-remove" />
        </button>
      );
    }
  })

  //--

  ns.TodoList = React.createClass({
    del: function() {
      this.props.delList(this.props.list._id);
    },

    sel: function() {
      this.props.selList(this.props.list._id);
    },

    render: function() {
      var actionable;
      if (this.props.list._id) {
        // Model is persisted
        actionable = <ns.DelBtn onClick={this.del} />
      } else {
        // If model does not have an _id yet
        // then it is not persisted yet and
        // cannot be deleted.
        actionable = <ns.Spinner />
      }
      return (
        <tr>
          <td>
            <div onClick={this.sel}>{this.props.list.name}</div>
          </td>
          <td>{actionable}</td>
        </tr>
      );
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
      return this.props.lists.map(function(list, i) {
        return <ns.TodoList
          key={"list_"+i}
          list={list}
          selList={this.props.selList}
          delList={this.props.delList} />
      }.bind(this));
    },

    render: function() {
      return (
        <div>
          <h3>
            Things to Do
          </h3>
          <form className="add" onSubmit={this.add}>
            <input type="text" name="name"
              value={this.state.newListName}
              onChange={this.newNameChange} />
            <input type="submit" value="Add" />
          </form>
          <table>
            <tbody>
                {this.buildList()}
            </tbody>
          </table>
        </div>
      );
    }
  });

  //--

  ns.TodoItem = React.createClass({
    del: function() {
      this.props.delItem(this.props.item._id);
    },

    render: function() {
      if (this.props.item._id) {
        return (
          <tr>
            <td width="60%">{this.props.item.name}</td>
            <td>
              <label>
                <input type="checkbox" />
                Finished
              </label>
            </td>
            <td><ns.DelBtn onClick={this.del} /></td>
          </tr>
        );
      } else {
        return (
          <tr>
            <td width="60%">{this.props.item.name}</td>
            <td colSpan="2">
              <ns.Spinner />
            </td>
          </tr>
        );
      }
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

    buildItems: function() {
      return this.props.items.map(function(item, i) {
        return <ns.TodoItem
          key={"item_"+i}
          item={item}
          delItem={this.props.delItem} />
      }.bind(this));
    },

    renderItems: function() {
      if (this.props.loading) {
        return <ns.Spinner />
      } else if (this.props.items.length) {
        return <table><tbody>{this.buildItems()}</tbody></table>
      } else {
        return (
          <p className="empty">
            <i className="fa fa-arrow-up" />
            Add something to do.
          </p>
        )
      }
    },

    render: function() {
      if (this.props.items) {
        return (
          <div>
            <h1>
              {this.props.name}
            </h1>
            <form className="add" onSubmit={this.add}>
              <input type="text" name="name"
                value={this.state.newItemName}
                onChange={this.newNameChange} />
              <input type="submit" value="Add" />
            </form>
            {this.renderItems()}
          </div>
        );
      } else {
        return (
          <div>
            <p className="empty">
              <i className="fa fa-arrow-left" />
              Create a list.
            </p>
          </div>
        );
      }
    }
  });

})(tiy.views);
