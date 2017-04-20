import _ from "lodash";
import React from "react";

import PairField from "/imports/ui/components/PairField";
import Icon from "/imports/ui/components/Daikon/Icon";

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
    this.elems = {};
    this.order = [];
    if (! _.isEmpty(this.props.defaultValue)) {
      _.each(this.props.defaultOrder, (key) => {
        const obj = this.props.defaultValue[key];
        this.order.push(key);
        this.elems[key] = {
          label: obj.label,
          value: obj.value
        };
      });
    } else {
      _.each(_.range(this.state.qty), () => {
        const key = Random.id();
        this.order.push(key);
        this.elems[key] = {
          label: "",
          value: ""
        };
      });
    }
  },
  handleAdd() {
    const key = Random.id();
    this.order.push(key);
    this.elems[key] = {
      label: "",
      value: ""
    };
    this.setState({
      qty: this.state.qty + 1,
      autoFocus: true
    });
  },
  handleRemove(id) {
    const idx = this.order.indexOf(id);
    if (idx !== 0) {
      this.order.splice(idx, 1);
      delete this.elems[id];
      this.setState({ qty: this.state.qty - 1 });
    }
    this.props.onChange(this.elems, this.order);
  },
  handleUpdate(id, label, value) {
    this.elems[id].label = label;
    this.elems[id].value = value;
    this.props.onChange(this.elems, this.order);
  },
  renderInner() {
    return _.map(this.order, (key) => {
      const elem = this.elems[key];
      return <PairField
        uniqueId={key}
        defaultLabel={elem.label}
        defaultValue={elem.value}
        onChange={this.handleUpdate}
        onRemove={this.handleRemove}
        autoFocus={this.state.autoFocus && key === _.last(this.order)}
        key={key}
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
            onClick={this.handleAdd}
          />
        </li>
      </ul>
    </div>;
  }
});
