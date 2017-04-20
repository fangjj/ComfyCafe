import React from "react";
import MenuItem from "material-ui/MenuItem";

import "/imports/api/pages/methods";
import PageForm from "/imports/ui/components/Page/PageForm";
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
    Meteor.call("deletePage", this.props.page._id, () => {
      if (this.props.redirect) {
        const path = FlowRouter.path("pageList");
        FlowRouter.go(path);
      }
    });
  },
  renderForm() {
    if (this.state.showForm) {
      return <DialogForm
        title="Edit Page"
        id={"form" + this.props.page._id}
        form={<PageForm page={this.props.page} noRedirect={true} />}
        onClose={this.hideForm}
      />;
    }
  },
  render() {
    const page = this.props.page;

    const owner = page.owner;
    const isOwner = this.context.currentUser && this.context.currentUser._id === owner._id;

    if (! isOwner) {
      return null;
    }

    return <MoreMenu form={this.renderForm()}>
      <MenuItem primaryText="Edit" onClick={this.showForm} />
      <MenuItem primaryText="Delete" onClick={this.delete} />
    </MoreMenu>;
  }
});
