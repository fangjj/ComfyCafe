import _ from "lodash";
import React from "react";

import setTitle from "/imports/api/common/setTitle";
import Content from "/imports/ui/client/components/Content";
import Medium from "/imports/ui/client/components/Medium";
import LoadingSpinner from "/imports/ui/client/components/Spinner/LoadingSpinner";
import InlineLoadingSpinner from "/imports/ui/client/components/Spinner/InlineLoadingSpinner";
import FAB from "/imports/ui/client/components/FAB";
import Dialog from "/imports/ui/client/components/Dialog";
import PageForm from "/imports/ui/client/components/Page/PageForm";
import Avatar from "/imports/ui/client/components/Avatar/Avatar";
import TextBody from "/imports/ui/client/components/TextBody";
import Moment from "/imports/ui/client/components/Moment";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import PrivacyIcon from "/imports/ui/client/components/Daikon/PrivacyIcon";
import UserLink from "/imports/ui/client/components/User/UserLink";
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
    if (this.props.loading) {
      return <LoadingSpinner />;
    }

    const page = this.props.page;
    setTitle(page.name);

    const owner = page.owner;
    const ownerUrl = FlowRouter.path("profile", { username: owner.username });
    const isOwner = _.get(this.props.currentUser, "_id") === page.owner._id;

    return <article className="album contentLayout">
      <section className="content">
        <header>
          <h2>{page.name}</h2>
        </header>
        <TextBody text={page.body} className="body" />
      </section>
      <section className="infoBox content">
        <div className="flexColumn">
          <div className="flexLayout">
            <div className="leftSide">
              <a href={ownerUrl}>
                <Avatar size="small" user={owner} />
              </a>
            </div>
            <div className="rightSide">
              <div className="top">
                <div className="genericCol">
                  <div className="info">
                    <Icon className="sigil">collections</Icon>
                    Written by <UserLink user={owner} /> <Moment time={page.createdAt} />
                  </div>
                  <div className="privacy">
                    <PrivacyIcon
                      className="sigil"
                      privacy={page.visibility}
                    /> {_.capitalize(page.visibility)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
