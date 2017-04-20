import _ from "lodash";
import React from "react";

import Content from "/imports/ui/components/Content";
import List from "/imports/ui/components/List";
import LoadingSpinner from "/imports/ui/components/Spinner/LoadingSpinner";
import InlineLoadingSpinner from "/imports/ui/components/Spinner/InlineLoadingSpinner";
import InlineUhoh from "/imports/ui/components/InlineUhoh";
import FAB from "/imports/ui/components/FAB";
import Dialog from "/imports/ui/components/Dialog";
import FilterForm from "/imports/ui/components/Filter/FilterForm";
import FilterListItem from "/imports/ui/components/Filter/FilterListItem";

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
  renderItems() {
    if (this.props.loading) {
      return <InlineLoadingSpinner />;
    }

    if (this.props.filters.length) {
      return _.map(this.props.filters, (filter) => {
        return <FilterListItem filter={filter} key={filter._id} />;
      });
    } else {
      return <InlineUhoh>
        {FlowRouter.getParam("username") + " hasn't created any filters yet!"}
      </InlineUhoh>;
    }
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Create Filter"
        formId="formNewFilter"
        open={true}
        onClose={this.hideForm}
      >
        <FilterForm
          id="formNewFilter"
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
      <FAB iconName="add" onClick={this.showForm} />
      {this.renderForm()}
    </Content>;
  }
});
