Chat = React.createClass({
  render() {
    return <div className="denseLayout">
      <GeminiScrollbar className="col leftCol">
        <TopicList />
      </GeminiScrollbar>

      <GeminiScrollbar className="col mainCol">
        <Topic />
      </GeminiScrollbar>
    </div>;
  }
});
