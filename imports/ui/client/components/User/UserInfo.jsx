import _ from "lodash";
import React from "react";

export default React.createClass({
  renderInner() {
    return _.map(this.props.order, (key) => {
      const obj = this.props.info[key];
      return <li key={[key, obj.label, obj.value].join("_")}>
        <div className="label">
          {obj.label}
        </div>
        <div className="value">
          {obj.value}
        </div>
      </li>;
    });
  },
  render() {
    return <div className="userInfo">
      <header>
  			<h3>Meaningful Details</h3>
  		</header>
			<ul>
        {this.renderInner()}
			</ul>
    </div>;
  }
});
