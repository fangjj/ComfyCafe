import React from "react";

import TagForm from "./TagForm";
import Dialog from "/imports/ui/components/Dialog";
import FAB from "/imports/ui/components/FAB";

export default React.createClass({
  getInitialState() {
    return { showForm: false };
  },
  showTagForm() {
    this.setState({ showForm: true });
  },
  hideTagForm() {
    this.setState({ showForm: false });
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Create Tag"
        formId="formNewTag"
        open={true}
        onClose={this.hideTagForm}
      >
        <TagForm
          id="formNewTag"
          onClose={this.hideTagForm}
        />
      </Dialog>;
    }
  },
  render() {
    return <FAB iconName="add" onClick={this.showTagForm}>
      {this.renderForm()}
    </FAB>;
  }
});
