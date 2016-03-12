let {
  TextField
} = mui;

TagField = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      currentStub: "",
      suggestions: []
    };
  },
  getMeteorData() {
    const handle = Meteor.subscribe("allTags");
    return {
      loading: ! handle.ready(),
      tags: Tags.find({}, { fields: { name: 1 } }).fetch(),
      currentUser: Meteor.user()
    };
  },
  onChange(e) {
    const value = _.last(e.target.value.split(/\s+/));
    if (value) {
      this.setState({
        suggestions: _.compact(
          _.map(this.data.tags, (tag) => {
            if (tag.name.substr(0, value.length) === value) {
              return tag.name;
            }
          }),
        )
      });
    } else {
      this.setState({
        suggestions: []
      });
    }
    this.props.onChange(e);
  },
  render() {
    if (this.data.loading) {
      return <InlineLoadingSpinner />;
    }

    return <div>
      <TextField
        defaultValue={this.props.defaultValue}
        floatingLabelText={this.props.floatingLabelText || "Tags"}
        floatingLabelStyle={{fontSize: "20px"}}
        multiLine={true}
        rows={3}
        rowsMax={5}
        onChange={this.onChange}
        fullWidth={true}
      />
      <Suggestions suggestions={this.state.suggestions} />
    </div>;
  }
});
