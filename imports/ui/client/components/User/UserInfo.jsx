import _ from "lodash";
import React from "react";

export default React.createClass({
  renderInner() {
    return _.map(this.props.info, (pair, id) => {
      const label = pair[0];
      const value = pair[1];
      return <li key={[id, label, value].join("_")}>
        <div className="label">
          {label}
        </div>
        <div className="value">
          {value}
        </div>
      </li>;
    });
  },
  render() {
    return <div className="userInfo">
      <header>
  			<h3>Info</h3>
  		</header>
			<ul>
        {this.renderInner()}
			</ul>
    </div>;
  }
});
