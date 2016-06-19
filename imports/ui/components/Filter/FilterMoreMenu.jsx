import React from "react";
import MenuItem from "material-ui/MenuItem";

import "/imports/api/filters/methods";
import FilterForm from "/imports/ui/components/Filter/FilterForm";
import DialogForm from "/imports/ui/components/DialogForm";
import MoreMenu from "/imports/ui/components/MoreMenu";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  getInitialState() {
    return { showForm: false };
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
    this.setState({ showForm: false });
  },
  delete() {
    Meteor.call("deleteFilter", this.props.filter._id, () => {
      if (this.props.redirect) {
        const path = FlowRouter.path("filterList");
        FlowRouter.go(path);
      }
    });
  },
  renderForm() {
    if (this.state.showForm) {
      return <DialogForm
        title="Edit Filter"
        id={"form" + this.props.filter._id}
        form={<FilterForm filter={this.props.filter} noRedirect={true} />}
        onClose={this.hideForm}
      />;
    }
  },
  render() {
    const filter = this.props.filter;

    const owner = filter.owner;
    const isOwner = this.context.currentUser && this.context.currentUser._id === owner._id;

    if (! isOwner) {
      return null;
    }

    return <MoreMenu form={this.renderForm()}>
      <MenuItem primaryText="Edit" onTouchTap={this.showForm} />
      <MenuItem primaryText="Delete" onTouchTap={this.delete} />
    </MoreMenu>;
  }
});
