PostModifyFAB = React.createClass({
  render() {
    return <div id="fabModify" className="fixed-action-btn">
      <a className="btn-floating btn-large">
        <i className="large material-icons">mode_edit</i>
      </a>
      <ul>
        <PostDeleteInnerFAB post={this.props.post} />
      </ul>
    </div>;
  }
});
