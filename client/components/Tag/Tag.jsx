/*
- Include a live parsing preview
*/

Tag = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    const name = FlowRouter.getParam("tagName");
    const handle = Meteor.subscribe("tag", name);
    return {
      loading: ! handle.ready(),
      tag: Tags.findOne({ name: name }),
      currentUser: Meteor.user()
    };
  },
  render() {
    if (this.data.loading) {
      return <LoadingSpinner />;
    }

    const tag = this.data.tag;
    return <article className="content">
      <header>
        <h2>{tag.name}</h2>
      </header>
      <TextBody text={tag.definition} />
      <TagEditFAB tag={tag} />
    </article>;
  }
});
