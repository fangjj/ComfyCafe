import React from "react";

import DenseContent from "/imports/ui/client/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";
import List from "/imports/ui/client/components/List";
import Dialog from "/imports/ui/client/components/Dialog";
import Form from "/imports/ui/client/components/Form";
import SubmitButton from "/imports/ui/client/components/Button/SubmitButton";
import FilterForm from "/imports/ui/client/components/Filter/FilterForm";

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
  renderGlobalList() {
    if (this.props.globalLoading) {
      return <DenseLoadingSpinner />;
    }

    return _.map(this.props.globalFilters, (filter) => {
      const path = FlowRouter.path("adminView", {
        panel: "filters",
        id: filter._id
      });
      return <li key={filter._id}>
        <a href={path}>{filter.name}</a>
      </li>;
    });
  },
  renderForm() {
    if (this.state.showForm) {
      return <Dialog
        title="Create Global Filter"
        formId="formNewGlobalFilter"
        open={true}
        onClose={this.hideForm}
      >
        <FilterForm
          id="formNewGlobalFilter"
          global={true}
          onSubmit={this.handleSubmit}
          onClose={this.hideForm}
        />
      </Dialog>;
    }
  },
  render() {
    return <DenseContent>
      <header>
        <h3>Global Filters</h3>
      </header>
      <SubmitButton
        label="Create Global Filter"
        iconName="filter_list"
        onTouchTap={this.showForm}
      />
      <List>
        {this.renderGlobalList()}
      </List>
      {this.renderForm()}
    </DenseContent>;
  }
});
