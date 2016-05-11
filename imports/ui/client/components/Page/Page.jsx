import _ from "lodash";
import React from "react";

import setTitle from "/imports/api/common/setTitle";
import Content from "/imports/ui/client/components/Content";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";
import FAB from "/imports/ui/client/components/FAB";
import Dialog from "/imports/ui/client/components/Dialog";
import PageForm from "/imports/ui/client/components/Page/PageForm";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import Moment from "/imports/ui/client/components/Moment";
import FlexHead from "/imports/ui/client/components/FlexHead";
import InlineTopic from "/imports/ui/client/components/Chat/InlineTopic";

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
  renderUpdated() {
    const page = this.props.page;
    if (! _.isEqual(page.createdAt, page.updatedAt)) {
      return <span>
        <Icon className="sigil">edit</Icon> Last updated <Moment time={page.updatedAt} />
      </span>
    }
  },
  renderFab(isOwner) {
    if (isOwner) {
      return <FAB iconName="edit" onTouchTap={this.showForm} />;
    }
  },
  renderForm(page) {
    if (this.state.showForm) {
      return <Dialog
        title="Edit Page"
        formId={"form" + page._id}
        open={true}
        onClose={this.hideForm}
      >
        <PageForm
          id={"form" + page._id}
          page={page}
          onClose={this.hideForm}
        />
      </Dialog>;
    }
  },
  render() {
    if (this.props.loading || ! this.props.page) {
      return <LoadingSpinner />;
    }

    const page = this.props.page;
    setTitle(page.name);

    const owner = page.owner;
    const ownerUrl = FlowRouter.path("profile", { username: owner.username });
    const isOwner = _.get(this.props.currentUser, "_id") === page.owner._id;

    return <article className="album contentLayout">
      <FlexHead
        className="content"
        title={page.name}
        item={this.props.page}
        sigil="ac_unit"
        verb="Written"
        renderInfo={this.renderUpdated}
        body={this.props.page.body}
        section={true}
      />
      <section className="comments content">
        <InlineTopic
          topicId={page.topic._id}
          currentUser={this.props.currentUser}
        />
      </section>
      {this.renderFab(isOwner)}
      {this.renderForm(page)}
    </article>;
  }
});
