(function(ns){

  ns.Header = React.createClass({
    render: function() {
      return <div id="header"><h2>Do All The Things!</h2></div>
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

  //--

  ns.DelBtn = React.createClass({
    render: function() {
      return (
        <button className="del-btn" onClick={this.props.onClick}>
          <i className="fa fa-remove" />
        </button>
      );
    }
  });

  //--

  ns.Root = React.createClass({
    getDefaultProps: function() {
      return {
        listsLoading: true,
        itemsLoading: false
      }
    },

    render: function() {
      if (this.props.listsLoading) {
        content = (
          <ns.Spinner className="large-spinner" />
        );
      } else {
        content = (
          <div className="columns">
            <div className="lists column">
              <ns.TodoLists
                lists={this.props.listData}
                addList={this.props.addList}
                delList={this.props.delList}
                selList={this.props.selList} />
            </div>

            <div className="items column">
              <ns.TodoItems
                items={this.props.itemData}
                loading={this.props.itemsLoading}
                addItem={this.props.addItem}
                delItem={this.props.delItem}
                finItem={this.props.finItem}
                name={this.props.selListName} />
            </div>
          </div>
        );
      }

      return (
        <div>
          <ns.Header />
          <div id="content">{content}</div>
          <ns.Footer />
        </div>
      );
    }
  });

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
          <td width="90%">
            <div className="list" onClick={this.sel}>{this.props.list.name}</div>
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
      var str = e.target.value;
      var cap = str.charAt(0).toUpperCase() + str.slice(1);
      this.setState({ newListName: cap });
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
            <input
              type="text"
              value={this.state.newListName}
              onChange={this.newNameChange} />
            <button type="submit">Add</button>
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

    fin: function(e) {
      var id = this.props.item._id;
      this.props.finItem(id, e.target.checked);
    },

    render: function() {
      if (this.props.item._id) {
        return (
          <tr>
            <td width="80%">{this.props.item.name}</td>
            <td>
              <label>
                <input
                  type="checkbox"
                  checked={!!this.props.item.completed_at}
                  onChange={this.fin} />
                Finished
              </label>
            </td>
            <td><ns.DelBtn onClick={this.del} /></td>
          </tr>
        );
      } else {
        return (
          <tr>
            <td width="80%">{this.props.item.name}</td>
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
      var str = e.target.value;
      var cap = str.charAt(0).toUpperCase() + str.slice(1);
      this.setState({ newItemName: cap });
    },

    buildItems: function() {
      return this.props.items.map(function(item, i) {
        return <ns.TodoItem
          key={"item_"+i}
          item={item}
          finItem={this.props.finItem}
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
          <p className="empty" style={{textAlign:"center"}}>
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
              <input
                type="text"
                value={this.state.newItemName}
                onChange={this.newNameChange} />
              <button type="submit">Add</button>
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
