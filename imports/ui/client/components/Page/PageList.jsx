import _ from "lodash";
import React from "react";

import Content from "/imports/ui/client/components/Content";
import List from "/imports/ui/client/components/List";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";
import InlineUhoh from "/imports/ui/client/components/InlineUhoh";
import FAB from "/imports/ui/client/components/FAB";
import Dialog from "/imports/ui/client/components/Dialog";
import PageForm from "/imports/ui/client/components/Page/PageForm";
import PageListItem from "/imports/ui/client/components/Page/PageListItem";

export default React.createClass({
  getInitialState() {
    return { showForm: false };
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
    this.setState({ showForm: false });
  },
  renderItems() {
    if (this.props.loading) {
      return <InlineLoadingSpinner />;
    }

    if (this.props.pages.length) {
      return _.map(this.props.pages, (page) => {
        return <PageListItem page={page} key={page._id} />;
      });
    } else {
      return <InlineUhoh>
        {FlowRouter.getParam("username") + " hasn't written any pages yet!"}
      </InlineUhoh>;
    }
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Compose Page"
        formId="formNewPage"
        open={true}
        onClose={this.hideForm}
      >
        <PageForm
          id="formNewPage"
          onClose={this.hideForm}
        />
      </Dialog>;
    }
  },
  render() {
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    return <Content>
      <List>
        {this.renderItems()}
      </List>
      <FAB iconName="add" onTouchTap={this.showForm} />
      {this.renderForm()}
    </Content>;
  }
});
