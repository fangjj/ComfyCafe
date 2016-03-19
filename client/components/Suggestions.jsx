let {
  DropDownMenu,
  MenuItem
} = mui;

Suggestions = React.createClass({
  getInitialState() {
    return {
      selected: undefined
    };
  },
  lookup: {},
  keyHandler(e) {
    if (! this.state.selected) {
      return;
    }

    const keys = {
      ENTER: 13,
      //LEFT: 37,
      UP: 38,
      //RIGHT: 39,
      DOWN: 40
    };

    const keyDown = e.which;
    if (! _.includes(_.values(keys), keyDown)) {
      return;
    }

    e.preventDefault();

    const currentIndex = () => {
      if (this.state.selected) {
        return this.lookup[this.state.selected];
      } return 0;
    }();
    const lookupLength = _.keys(this.lookup).length;
    const canGoDown = currentIndex < lookupLength;
    const canGoUp = currentIndex !== 0 && lookupLength > 1;

    const actionMap = {};
    actionMap[keys.ENTER] = () => {
      this.props.onSelect(
        _.find(this.props.suggestions, (s, idx) => {
          return idx === currentIndex;
        })
      );
    };
    actionMap[keys.DOWN] = () => {
      if (canGoDown) {
        // Reckless reduction!
        return _.reduce(
          this.lookup,
          (result, value, key) => {
            if (value === currentIndex + 1) {
              return key;
            } return result;
          },
          this.state.selected
        );
      }
    };
    actionMap[keys.UP] = () => {
      if (canGoUp) {
        return _.reduce(
          this.lookup,
          (result, value, key) => {
            if (value === currentIndex - 1) {
              return key;
            } return result;
          },
          this.state.selected
        );
      }
    };

    const selection = actionMap[keyDown]();
    if (selection) {
      this.setState({
        selected: selection
      });
    }
  },
  componentDidMount() {
    window.addEventListener("keydown", this.keyHandler);
  },
  componentWillUnmount() {
    window.removeEventListener("keydown", this.keyHandler);
  },
  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions && nextProps.suggestions !== this.props.suggestions) {
      this.lookup = {};
      _.each(nextProps.suggestions, (value, idx) => {
        this.lookup[value._id] = idx;
        if (idx === 0) {
          this.setState({
            selected: nextProps.suggestions[0]._id
          });
        }
      });
    }
  },
  renderSuggestions() {
    if (this.props.suggestions && this.props.suggestions.length) {
      return this.props.suggestions.map((s, idx) => {
        return <li
          className={this.state.selected === s._id ? "selected" : ""}
          key={s._id}
        >
          <LinkButton primaryText={s.name} onTouchTap={() => {
            this.props.onSelect(s);
          }} />
        </li>;
      });
    }
  },
  renderInner() {
    if (this.props.suggestions && this.props.suggestions.length) {
      return <ul className="suggestions list">
        {this.renderSuggestions()}
      </ul>;
    }
  },
  render() {
    const anchorCoords = this.props.anchorCoords || {top: 0, left: 0};
    const caretCoords = this.props.caretCoords || {top: 0, left: 0};
    const style = {
      top: anchorCoords.top + caretCoords.top + 20,
      left: caretCoords.left
    };
    return <div className="suggestionContainer" style={style}>
      {this.renderInner()}
    </div>;
  }
});
