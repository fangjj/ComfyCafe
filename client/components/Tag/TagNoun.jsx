TagNoun = React.createClass({
  render() {
    const noun = this.props.noun;
    const nounType = "generic";
    return <a
      className={"taglet noun " + nounType}
      href={"/q/" + noun}
    >{noun}</a>;
  }
});
