TagAdjectivesComponent = React.createClass({
  concat() {
    if (this.props.adjectives) {
      return this.props.adjectives.map((a) => { return a.name; }).join(" ");
    }
  },
  render() {
    // original hack: {{#each adjectives}}{{#if isEditing}}{{name}} {{else}}{{name}} {{/if}}{{/each}}

    var classes = "taglet adj";
    if (this.props.new) {
      classes += " new";
    }

    return <a
      className={classes}
      data-placeholder="adjectives"
      contentEditable={this.props.editable}
    >{this.concat()}</a>
  }
});
