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
  componentWillMount() {
    this.elems = [];
    if (this.props.defaultValue) {
      _.each(this.props.defaultValue, (arr, key) => {
        this.elems.push({
          key: key,
          cond: arr[0],
          impl: arr[1]
        });
      });
    } else {
      this.elems.push({
        key: _.uniqueId(),
        cond: "",
        impl: this.props.defaultImplications
      });
    }
  },
  handleAdd() {
    this.elems.push({
      key: _.uniqueId(),
      cond: "",
      impl: this.props.defaultImplications
    });
    this.setState({ qty: this.state.qty + 1 });
  },
  renderInner() {
    return _.map(this.elems, (elem) => {
      return <TagConditionalField
        condImplId={elem.key}
        inheritFrom={this.props.inheritFrom}
        injectRoot={this.props.injectRoot}
        defaultCondition={elem.cond}
        defaultImplications={elem.impl}
        onChange={this.props.onChange}
        key={elem.key}
      />;
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
