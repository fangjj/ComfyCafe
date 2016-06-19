import React from "react";

export default () => {
  const helpUrl = FlowRouter.path("help");
  const rulesUrl = FlowRouter.path("guidelines");
  const aboutUrl = FlowRouter.path("about");
  const legalUrl = FlowRouter.path("legal");
  return <footer className="mainFooter">
    <a href={helpUrl}>Help</a> · <a href={rulesUrl}>Rules</a> · <a href={aboutUrl}>About</a> · <a href={legalUrl}>Legal</a> · <a href="https://github.com/ComfySoft/ComfyCafe">Source</a> · <a href="https://trello.com/b/IlpjYc9X/comfycafe">Roadmap</a>
  </footer>;
};
