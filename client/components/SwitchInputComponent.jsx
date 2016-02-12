SwitchInputComponent = React.createClass({
  render() {
    return <div className="switch">
      <label>
        {this.props.off}
        <input
          name={this.props.name}
          type="checkbox"
          checked={this.props.checked}
          onChange={this.props.onChange}
        />
        <span className="lever"></span>
        {this.props.on}
      </label>
    </div>;
  }
});
