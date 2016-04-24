import _ from "lodash";
import React from "react";

import InfoBox from "/imports/ui/client/components/InfoBox";
import TextBody from "/imports/ui/client/components/TextBody";
import Icon from "/imports/ui/client/components/Daikon/Icon";
import OriginalityIcon from "/imports/ui/client/components/Daikon/OriginalityIcon";
import PrivacyIcon from "/imports/ui/client/components/Daikon/PrivacyIcon";
import Moment from "/imports/ui/client/components/Moment";
import Avatar from "/imports/ui/client/components/Avatar/Avatar";
import UserLink from "/imports/ui/client/components/User/UserLink";

export default React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired,
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
      return <header>
        <h2>{this.props.title}</h2>
      </header>;
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
    if (_.has(this.props.item, "visibility")) {
      return <div className="privacy">
        <PrivacyIcon
          className="sigil"
          privacy={this.props.item.visibility}
        /> {_.capitalize(this.props.item.visibility)}
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
    </InfoBox>;
  }
});
