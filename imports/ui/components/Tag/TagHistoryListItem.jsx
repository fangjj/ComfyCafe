import React from "react";

import UserLink from "/imports/ui/components/User/UserLink";
import Moment from "/imports/ui/components/Moment";

export default React.createClass({
  render() {
    const item = this.props.item;
    const tagId = FlowRouter.getParam("tagId");
    const url = FlowRouter.path("tagHistoryItem", { tagId, id: item._id });
    return <li>
      Updated by <UserLink user={item.owner} /> <Moment time={item.updatedAt} /> <a href={url}>(view)</a>
    </li>;
  }
});
