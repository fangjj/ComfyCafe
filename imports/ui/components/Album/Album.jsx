import _ from "lodash";
import React from "react";

import setTitle from "/imports/ui/utils/setTitle";
import metaBuilder from "/imports/ui/utils/metaBuilder";
import Content from "/imports/ui/components/Content";
import LoadingSpinner from "/imports/ui/components/Spinner/LoadingSpinner";
import InlineLoadingSpinner from "/imports/ui/components/Spinner/InlineLoadingSpinner";
import FAB from "/imports/ui/components/FAB";
import Dialog from "/imports/ui/components/Dialog";
import AlbumForm from "/imports/ui/components/Album/AlbumForm";
import FlexHead from "/imports/ui/components/FlexHead";
import InlineTopic from "/imports/ui/components/Chat/InlineTopic";
import PostBrowseAlbum from "/imports/ui/components/Post/PostBrowseAlbum";
import ReportButton from "/imports/ui/components/Button/ReportButton";
import ButtonGroup from "/imports/ui/components/Button/ButtonGroup";
import ActionWell from "/imports/ui/components/ActionWell";
import DialogForm from "/imports/ui/components/DialogForm";
import ReportForm from "/imports/ui/components/Report/ReportForm";

export default React.createClass({
  getInitialState() {
    return { showForm: false, showReportForm: false };
  },
  componentWillMount() {
    metaBuilder({
      title: this.props.album.name,
      description: this.props.album.description
    });
  },
  showForm() {
    this.setState({ showForm: true });
  },
  hideForm() {
    this.setState({ showForm: false });
  },
  showReportForm() {
    this.setState({ showReportForm: true });
  },
  hideReportForm() {
    this.setState({ showReportForm: false });
  },
  renderReportForm() {
    if (this.state.showReportForm) {
      return <DialogForm
        title="Report Album"
        id={"formReport" + this.props.album._id}
        onClose={this.hideReportForm}
        form={<ReportForm
          item={this.props.album}
          itemType="album"
        />}
      />;
    }
  },
  renderButtons() {
    const isOwner = _.get(this.props.currentUser, "_id") === this.props.album.owner._id;
    if (isOwner) {
      return;
    }

    return <ActionWell>
      <ButtonGroup>
        <ReportButton onClick={this.showReportForm} />
      </ButtonGroup>
      <div />
    </ActionWell>;
  },
  renderFab(isOwner) {
    if (isOwner) {
      return <FAB iconName="edit" onClick={this.showForm} />;
    }
  },
  renderForm(album) {
    if (this.state.showForm) {
      return <Dialog
        title="Edit Album"
        formId={"form" + album._id}
        open={true}
        onClose={this.hideForm}
      >
        <AlbumForm
          id={"form" + album._id}
          album={album}
          onClose={this.hideForm}
        />
      </Dialog>;
    }
  },
  render() {
    if (this.props.loading || ! this.props.album) {
      return <LoadingSpinner />;
    }

    const album = this.props.album;
    setTitle(album.name);

    const owner = album.owner;
    const ownerUrl = FlowRouter.path("profile", { username: owner.username });
    const isOwner = _.get(this.props.currentUser, "_id") === album.owner._id;

    return <article className="album contentLayout">
      <PostBrowseAlbum />
      <FlexHead
        className="content"
        title={album.name}
        item={album}
        itemType="album"
        sigil="collections"
        verb="Collected"
        renderButtons={this.renderButtons}
        body={album.description}
        section={true}
      />
      <section className="comments content">
        <InlineTopic
          topicId={album.topic._id}
          currentUser={this.props.currentUser}
        />
      </section>
      {this.renderFab(isOwner)}
      {this.renderForm(album)}
      {this.renderReportForm()}
    </article>;
  }
});
