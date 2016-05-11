import _ from "lodash";
import React from "react";

import Content from "/imports/ui/client/components/Content";
import List from "/imports/ui/client/components/List";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";
import InlineUhoh from "/imports/ui/client/components/InlineUhoh";
import FAB from "/imports/ui/client/components/FAB";
import Dialog from "/imports/ui/client/components/Dialog";
import FilterForm from "/imports/ui/client/components/Filter/FilterForm";
import FilterListItem from "/imports/ui/client/components/Filter/FilterListItem";

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
  renderFavorites() {
    if (this.props.favoritesLoading) {
      return <InlineLoadingSpinner />;
    }

    if (this.props.favoriteFilters.length) {
      return _.map(this.props.favoriteFilters, (filter) => {
        return <FilterListItem filter={filter} key={filter._id} />;
      });
    } else {
      return <InlineUhoh>
        {FlowRouter.getParam("username") + " hasn't favorited any filters yet."}
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
      <section>
        <header>
          <h2>Created</h2>
        </header>
        <List>
          {this.renderItems()}
        </List>
      </section>
      <section>
        <header>
          <h2>Favorited</h2>
        </header>
        <List>
          {this.renderFavorites()}
        </List>
      </section>
      <FAB iconName="add" onTouchTap={this.showForm} />
      {this.renderForm()}
    </Content>;
  }
});
