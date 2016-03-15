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
  renderAliases(tag) {
    if (tag.aliases) {
      const aliases = fancyCommaJoin(tag.aliases);
      return <span>
        Aliases: {aliases}
        <br />
      </span>;
    }
  },
  renderOrigin(tag) {
    if (tag.type !== "origin") {
      return <span>
        Origin: {tag.origin}
      </span>;
    }
  },
  renderTagTree(tag) {
    if (tag.implications) {
      return <TagTree
        tags={tag.implications}
      />;
    }
  },
  renderCondImpl(tag) {
    if (tag.condImplications) {
      return _.map(tag.condImplications, (impl, cond) => {
        return <div key={_.uniqueId()}>
          {cond}
          <TagTree tags={impl} />
        </div>;
      });
    }
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
      Type: {tag.type}
      <br />
      {this.renderAliases(tag)}
      {this.renderOrigin(tag)}
      <TextBody text={tag.definition} />
      {this.renderTagTree(tag)}
      {this.renderCondImpl(tag)}
      <TagEditFAB tag={tag} />
    </article>;
  }
});
