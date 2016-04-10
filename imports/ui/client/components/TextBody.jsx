import React from "react";
import marked from "marked";
import Autolinker from "autolinker.js";
import emojione from "emojione";

import classConcat from "/imports/ui/client/utils/classConcat";
import linkMentions from "/imports/api/common/linkMentions";

export default React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.text !== nextProps.text
      // className probably won't change, but just in case...
      || this.props.className !== nextProps.className;
  },
  transform() {
    let $elem = $(this.refs.body);
    $elem.html(marked($elem.html()));
    $elem.html(Autolinker.link($elem.html(), {
      newWindow: false,
      stripPrefix: false,
      twitter: false,
      hashtag: false
    }));
    linkMentions($elem);
    $elem.html(emojione.toImage($elem.html()));
  },
  componentDidMount() {
    this.transform();
  },
  componentDidUpdate() {
    this.transform();
  },
  render() {
    const classes = classConcat("textBody", this.props.className);
    return <div className={classes} ref="body">
      {this.props.text}
    </div>;
  }
});
