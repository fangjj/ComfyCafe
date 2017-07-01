import _ from "lodash";
import React from "react";

import { isMod } from "/imports/api/common/persimmons";
import publishedMap from "/imports/ui/utils/publishedMap";
import InfoBox from "/imports/ui/components/InfoBox";
import TextBody from "/imports/ui/components/TextBody";
import Icon from "/imports/ui/components/Daikon/Icon";
import OriginalityIcon from "/imports/ui/components/Daikon/OriginalityIcon";
import PrivacyIcon from "/imports/ui/components/Daikon/PrivacyIcon";
import Moment from "/imports/ui/components/Moment";
import Avatar from "/imports/ui/components/Avatar/Avatar";
import UserLink from "/imports/ui/components/User/UserLink";
import ModButton from "/imports/ui/components/ModButton";

export default React.createClass({
  contextTypes: { currentUser: React.PropTypes.object },
  propTypes: {
    item: React.PropTypes.object.isRequired,
    itemType: React.PropTypes.string,
    title: React.PropTypes.string,
    sigil: React.PropTypes.string,
    verb: React.PropTypes.string.isRequired,
    renderInfo: React.PropTypes.func,
    renderButtons: React.PropTypes.func,
    body: React.PropTypes.string,

    // Presentational stuff
    className: React.PropTypes.string,
    section: React.PropTypes.bool
  },
  renderTitle() {
    if (this.props.title) {
      return <h2>{this.props.title}</h2>;
    }
  },
  renderSigil() {
    if (_.has(this.props.item, "originality")) {
      return <OriginalityIcon
        className="sigil"
        originality={this.props.item.originality}
      />;
    } else {
      return <Icon className="sigil">{this.props.sigil}</Icon>;
    }
  },
  renderVisibility() {
    if (_.has(this.props.item, "published")) {
      return <div className="privacy">
        <PrivacyIcon
          className="sigil"
          published={this.props.item.published}
        /> {_.capitalize(publishedMap(this.props.item.published))}
      </div>;
    }
  },
  renderInfo() {
    if (_.isFunction(this.props.renderInfo)) {
      return this.props.renderInfo();
    }
  },
  renderButtons() {
    if (_.isFunction(this.props.renderButtons)) {
      return this.props.renderButtons();
    }
  },
  renderBody() {
    if (this.props.body) {
      return <TextBody text={this.props.body} className="body" />;
    }
  },
  renderModIcon(item) {
    if (this.context.currentUser && isMod(this.context.currentUser._id) && this.props.itemType) {
      return <ModButton item={item} itemType={this.props.itemType} />;
    }
  },
  render() {
    const item = this.props.item;
    const owner = item.owner;
    const ownerUrl = FlowRouter.path("profile", { username: owner.username });
    return <InfoBox className={this.props.className} section={this.props.section}>
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
                {this.renderTitle()}
                <div className="info">
                  {this.renderSigil()}
                  {this.props.verb} by <UserLink user={owner} /> <Moment time={item.createdAt} />
                </div>
                {this.renderVisibility()}
                {this.renderInfo()}
              </div>
            </div>
          </div>
        </div>
        {this.renderButtons()}
        {this.renderBody()}
      </div>
      {this.renderModIcon(item)}
    </InfoBox>;
  }
});
