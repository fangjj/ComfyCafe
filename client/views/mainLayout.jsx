MainLayout = React.createClass({
  render: function () {
    return <div>
      <header>
        bleep bloop
      </header>
      <main>
        {this.props.content}
      </main>
      <footer>
        © 2016 Pepperoni Pizza Inc.
      </footer>
    </div>;
  }
});
