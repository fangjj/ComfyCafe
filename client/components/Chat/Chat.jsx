Chat = React.createClass({
  renderMain() {
    if (FlowRouter.getParam("topicId")) {
      return <Topic />;
    }
    return <Room />;
  },
  render() {
    return <DenseLayout>
      <DenseCol className="leftCol">
        <TopicList />
      </DenseCol>

      <DenseCol className="mainCol">
        {this.renderMain()}
      </DenseCol>
    </DenseLayout>;
  }
});
