import _ from "lodash";
import React from "react";

import DenseContent from "/imports/ui/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/components/Spinner/DenseLoadingSpinner";
import List from "/imports/ui/components/List";
import Dialog from "/imports/ui/components/Dialog";
import Form from "/imports/ui/components/Form";
import SubmitButton from "/imports/ui/components/Button/SubmitButton";
import FilterForm from "/imports/ui/components/Filter/FilterForm";

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
        onClick={this.showForm}
      />
      <List>
        {this.renderGlobalList()}
      </List>
      {this.renderForm()}
    </DenseContent>;
  }
});
