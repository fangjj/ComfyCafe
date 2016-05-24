import React from "react";

import Content from "/imports/ui/components/Content";
import TextField from "/imports/ui/components/TextField";
import UserListContainer from "/imports/ui/components/User/UserListContainer";

export default React.createClass({
  getInitialState() {
    return { query: "" };
  },
  handleSearch(e) {
    this.setState({ query: e.target.value });
  },
  renderHeader() {
    if (this.props.title) {
      return <header>
        <h2>{this.props.title}</h2>
      </header>;
    }
  },
  render() {
    return <Content>
      {this.renderHeader()}
      <TextField
        id={this.props.id}
        hintText="Search"
        onChange={this.handleSearch}
      />
      <UserListContainer {...this.state} {...this.props} />
    </Content>;
  }
});
