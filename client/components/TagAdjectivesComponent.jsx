TagAdjectivesComponent = React.createClass({
  concat() {
    return this.props.adjectives.map((a) => { return a.name; }).join(" ");
  },
  render() {
    // original hack: {{#each adjectives}}{{#if isEditing}}{{name}} {{else}}{{name}} {{/if}}{{/each}}
    return <a
      className="taglet adj"
      data-placeholder="adjectives"
      contentEditable={this.props.editable}
    >{this.concat()}</a>
  }
});
