TagNoun = React.createClass({
  render() {
    var noun = this.props.noun;
    return <a
      className={"taglet noun " + noun.type}
      href={"/q/" + noun.name}
    >{noun.name}</a>;
  }
});
