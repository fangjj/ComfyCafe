TagNounComponent = React.createClass({
  render() {
    // original hack: {{#if isEditing}}{{name}}{{else}}{{name}}{{/if}}
    return <a
      className={"taglet noun " + this.props.noun.type}
      href={"/q/" + this.props.noun.name}
      data-placeholder="noun"
      contentEditable={this.props.editable}
    >{this.props.noun.name}</a>;
  }
});
