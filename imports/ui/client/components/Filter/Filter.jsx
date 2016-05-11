import _ from "lodash";
import React from "react";

import setTitle from "/imports/api/common/setTitle";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import FAB from "/imports/ui/client/components/FAB";
import Dialog from "/imports/ui/client/components/Dialog";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import FilterForm from "/imports/ui/client/components/Filter/FilterForm";

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
  renderUpdated() {
    const filter = this.props.filter;
    if (! _.isEqual(filter.createdAt, filter.updatedAt)) {
      return <span>
        <Icon className="sigil">edit</Icon> Last updated <Moment time={filter.updatedAt} />
      </span>
    }
  },
  renderFab(isOwner) {
    if (isOwner) {
      return <FAB iconName="edit" onTouchTap={this.showForm} />;
    }
  },
  renderForm(filter) {
    if (this.state.showForm) {
      return <Dialog
        title="Edit Filter"
        formId={"form" + filter._id}
        open={true}
        onClose={this.hideForm}
      >
        <FilterForm
          id={"form" + filter._id}
          filter={filter}
          onClose={this.hideForm}
        />
      </Dialog>;
    }
  },
  renderSpoilers(filter) {
    return <section>
      <header>
        <h3>Spoilers</h3>
      </header>
      {filter.spoilers.text || <span className="na">Nothing</span>}
    </section>;
  },
  renderHides(filter) {
    return <section>
      <header>
        <h3>Hides</h3>
      </header>
      {filter.hides.text || <span className="na">Nothing</span>}
    </section>;
  },
  render() {
    if (this.props.loading || ! this.props.filter) {
      return <LoadingSpinner />;
    }

    const filter = this.props.filter;
    setTitle(filter.name);

    const owner = filter.owner;
    const ownerUrl = FlowRouter.path("profile", { username: owner.username });
    const isOwner = _.get(this.context.currentUser, "_id") === filter.owner._id;

    return <article className="filter content">
      <header>
        <h2>{filter.name}</h2>
      </header>
      <div className="genericCol">
        {this.renderSpoilers(filter)}
        {this.renderHides(filter)}
      </div>
      {this.renderFab(isOwner)}
      {this.renderForm(filter)}
    </article>;
  }
});
