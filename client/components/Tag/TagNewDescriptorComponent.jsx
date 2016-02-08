TagNewDescriptorComponent = React.createClass({
  render() {
    return <li className="descriptor new">
      <a className="taglet adj new" data-placeholder="adjectives" contentEditable></a>
      <a className="taglet noun new" data-placeholder="noun" contentEditable></a>
    </li>;
  }
});
