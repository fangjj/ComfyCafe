import _ from "lodash";
import React from "react";

import PairField from "/imports/ui/client/components/PairField";
import Icon from "/imports/ui/client/components/Daikon/Icon";

import {
  TextField,
  FlatButton
} from "material-ui";

export default React.createClass({
  getInitialState() {
    return {
      qty: this.props.defaultQty || 1
    };
  },
  componentWillMount() {
    this.elems = [];
    if (! _.isEmpty(this.props.defaultValue)) {
      _.each(this.props.defaultValue, (arr, key) => {
        this.elems.push({
          key: key,
          label: arr[0],
          value: arr[1]
        });
      });
    } else {
      _.each(_.range(this.state.qty), () => {
        this.elems.push({
          key: Random.id(),
          label: "",
          value: ""
        });
      });
    }
  },
  handleAdd() {
    this.elems.push({
      key: Random.id(),
      label: "",
      value: ""
    });
    this.setState({ qty: this.state.qty + 1 });
  },
  handleRemove(id) {
    const idx = _.reduce(
      this.elems,
      (result, value, index) => {
        if (value.key === id) {
          return index;
        }
        return result;
      },
      -1
    );

    if (idx !== 0) {
      this.elems.splice(idx, 1);
      this.setState({ qty: this.state.qty - 1 });
    }
  },
  renderInner() {
    return _.map(this.elems, (elem) => {
      return <PairField
        uniqueId={elem.key}
        defaultLabel={elem.label}
        defaultValue={elem.value}
        onChange={this.props.onChange}
        onRemove={this.handleRemove}
        key={elem.key}
      />;
    });
  },
  render() {
    return <div className="multiField">
      <header>
        <h3>{this.props.label}</h3>
      </header>
      <ul>
        {this.renderInner()}
        <li>
          <FlatButton
            label="Add Another"
            icon={<Icon>add</Icon>}
            onTouchTap={this.handleAdd}
          />
        </li>
      </ul>
    </div>;
  }
});
