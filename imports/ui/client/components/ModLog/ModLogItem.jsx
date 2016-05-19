import _ from "lodash";
import React from "react";

import violationMap from "/imports/api/common/violationMap";
import TypeIcon from "/imports/ui/client/components/Daikon/TypeIcon";
import Moment from "/imports/ui/client/components/Moment";
import UserLink from "/imports/ui/client/components/User/UserLink";

export default (props) => {
  const { ml } = props;
  const verb = _.capitalize(ml.item.action);
  return <li className="modLogItem">
    <a href={ml.item.url}>
      <TypeIcon className="sigil" value={ml.item.type} />
      <span>{violationMap[ml.violation]}</span>
    </a>
    <div className="genericCol">
      <div>{verb} by <UserLink user={ml.owner} /> <Moment time={ml.createdAt} /></div>
      <div>
        {_.capitalize(ml.item.type) + " "}
        <dfn title="ItemID">{ml.item._id}</dfn> by <dfn title="OwnerID">{ml.item.ownerId}</dfn>
      </div>
      <div>{ml.details}</div>
    </div>
    {props.children}
  </li>;
};
