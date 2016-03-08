TagList = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const handle = Meteor.subscribe("allTags");
    return {
      loading: ! handle.ready(),
      tags: Tags.find().fetch(),
      currentUser: Meteor.user()
    };
  },
  renderTags() {
    if (this.data.tags.length) {
      return this.data.tags.map((tag) => {
        return <TagListItem
          tag={tag}
          currentUser={this.data.currentUser}
          key={tag._id}
        />;
      });
    }
    return <li>No tags.</li>
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinner />;
    }

    return <div className="content">
      <ul className="list">
        {this.renderTags()}
      </ul>
      <TagFAB />
    </div>;
  }
});
