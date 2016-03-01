Chat = React.createClass({
  render() {
    return <DenseLayout>
      <DenseCol className="leftCol">
        <TopicList />
      </DenseCol>

      <DenseCol className="mainCol">
        <Topic />
      </DenseCol>
    </DenseLayout>;
  }
});
