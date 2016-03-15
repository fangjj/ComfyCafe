let {
  FontIcon,
  IconButton
} = mui;

TagMultiField = React.createClass({
  getInitialState() {
    return {
      qty: 1
    };
  },
  makeField() {
    return <TagConditionalField
      defaultImplications={this.props.defaultImplications}
      onChange={this.props.onChange}
      key={_.uniqueId()}
    />;
  },
  componentWillMount() {
    this.elems = [this.makeField()];
  },
  handleAdd() {
    this.elems.push(this.makeField());
    this.setState({ qty: this.state.qty + 1 });
  },
  renderInner() {
    return _.map(this.elems, (elem) => {
      return elem;
    });
  },
  render() {
    return <ul>
      {this.renderInner()}
      <li>
        <IconButton onTouchTap={this.handleAdd}>
          <FontIcon className="material-icons">add</FontIcon>
        </IconButton>
      </li>
    </ul>;
  }
});
