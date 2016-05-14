import _ from "lodash";
import React from "react";
import moment from "moment";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

// http://stackoverflow.com/a/1184359/5435443
// Month is 1 based
// Use 2000 as year, so it's always a leap year.
function daysInMonth(month) {
  return new Date(2000, month, 0).getDate();
}

const itemStyle = { fontSize: "17px" };

export default React.createClass({
  getInitialState() {
    return {
      month: this.props.month || 1,
      day: this.props.day || 1
    };
  },
  afterOnChange() {
    if (_.isFunction(this.props.onChange)) {
      this.props.onChange(this.state.month, this.state.day);
    }
  },
  onChangeMonth(e, i, value) {
    this.setState({ month: parseInt(value) }, this.afterOnChange);
  },
  onChangeDay(e, i, value) {
    this.setState({ day: parseInt(value) }, this.afterOnChange);
  },
  renderMonths() {
    return _.map(_.range(0, 12), (value, key) => {
      const month = moment().month(value).format("MMMM");
      return <MenuItem value={value+1} primaryText={month} style={itemStyle} key={key} />;
    });
  },
  renderDays() {
    const days = _.range(1, daysInMonth(this.state.month)+1);
    return _.map(days, (value, key) => {
      return <MenuItem value={value} primaryText={value} style={itemStyle} key={key} />;
    });
  },
  render() {
    return <div className="birthdaySelector">
      <header>
        <h3>{this.props.label || "Birthday"}</h3>
      </header>
      <div className="inner">
        <SelectField
          floatingLabelText="Month"
          floatingLabelStyle={{ fontSize: "20px" }}
          value={this.state.month}
          fullWidth={true}
          onChange={this.onChangeMonth}
        >
          {this.renderMonths()}
        </SelectField>
        <SelectField
          floatingLabelText="Day"
          floatingLabelStyle={{ fontSize: "20px" }}
          value={this.state.day}
          fullWidth={true}
          onChange={this.onChangeDay}
        >
          {this.renderDays()}
        </SelectField>
      </div>
    </div>;
  }
});
