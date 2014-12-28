(function(ns){

  ns.Record = React.createClass({
    render: function() {
      return <div className="record">
          <span>{this.props.name}</span>
        </div>;
    }
  });

  ns.Records = React.createClass({
    renderChildren: function() {
      return this.props.records.map(function(record) {
        var Record = ns.Record;
        return <Record name={record.get("name")} />
      }.bind(this));
    },
    render: function() {
      return <div>
          <h1>Records</h1>
          <ul>{this.renderChildren()}</ul>
        </div>;
    }
  });

})(tiy.views);
