MainLayout = React.createClass({
  render() {
    return <div>
      <header>
        <TopBarComponent />
      </header>
      <main>
        {this.props.content}
      </main>
      {this.props.fab}
      <footer>
        © 2016 Pepperoni Pizza Inc.
      </footer>
    </div>;
  }
});
