import _ from "lodash";
import React from "react";

import setTitle from "/imports/ui/utils/setTitle";
import LoadingSpinner from "/imports/ui/components/Spinner/LoadingSpinner";
import FAB from "/imports/ui/components/FAB";
import Dialog from "/imports/ui/components/Dialog";
import Icon from "/imports/ui/components/Daikon/Icon";
import FilterForm from "/imports/ui/components/Filter/FilterForm";

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
      return <FAB iconName="edit" onClick={this.showForm} />;
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
      <div className="textBody body">
        <p>{filter.spoilers || <span className="na">Nothing</span>}</p>
      </div>
    </section>;
  },
  renderHides(filter) {
    return <section>
      <header>
        <h3>Hides</h3>
      </header>
      <div className="textBody body">
        <p>{filter.hides || <span className="na">Nothing</span>}</p>
      </div>
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
