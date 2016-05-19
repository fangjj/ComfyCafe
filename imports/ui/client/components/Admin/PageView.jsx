import React from "react";

import DenseContent from "/imports/ui/client/components/DenseContent";
import DenseLoadingSpinner from "/imports/ui/client/components/Spinner/DenseLoadingSpinner";
import Err404 from "/imports/ui/client/components/Err404";
import PageForm from "/imports/ui/client/components/Page/PageForm";

export default React.createClass({
  render() {
    if (this.props.loading) {
      return <DenseLoadingSpinner />;
    }

    const page = this.props.page;
    if (! page) {
      return <Err404 />;
    }

    const url = FlowRouter.path("page", {
      username: page.owner.username,
      slug: page.slug
    });
    const ownerUrl = FlowRouter.path("profile", { username: page.owner.username });
    return <DenseContent>
      <header>
        <h2><a href={ownerUrl}>{page.owner.username}</a>/<a href={url}>{page.name}</a></h2>
      </header>
      <PageForm page={page} mod={true} actions={true} />
    </DenseContent>;
  }
});
