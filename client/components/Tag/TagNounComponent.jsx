TagNounComponent = React.createClass({
  render() {
    // original hack: {{#if isEditing}}{{name}}{{else}}{{name}}{{/if}}

    var noun = this.props.noun;
    if (! noun) {
      noun = {
        name: "",
        type: "generic"
      };
    }

    var tagUrl;
    if (! this.props.editable) {
      tagUrl = "/q/" + noun.name;
    }

    var classes = "taglet noun " + noun.type;
    if (this.props.new) {
      classes += " new";
    }

    return <a
      className={classes}
      href={tagUrl}
      data-placeholder="noun"
      contentEditable={this.props.editable}
    >{noun.name}</a>;
  }
});
