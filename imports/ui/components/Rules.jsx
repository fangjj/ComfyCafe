import React from "react";

import Content from "/imports/ui/components/Content";

export default () => {
  return <Content>
    <div className="textBody">
      <header>
        <h2>Community Guidelines</h2>
      </header>

      Last updated 16 June 2016

      <ul className="toc">
        <li><a href="#illegal">Illegal Activity</a></li>
        <li><a href="#mismarked">Mismarked Content</a></li>
        <li><a href="#crack">Cracking</a></li>
      </ul>

      <p>
        ComfyCafé is a pretty laid-back site, as the name would imply.
        However, there are still some rules you need to follow.
      </p>

      <section id="illegal">
        <header>
          <h3>Illegal Activity</h3>
        </header>
        <p>
          Don't do anything illegal. This one is super simple.
        </p>
      </section>

      <section id="mismarked">
        <header>
          <h3>Mismarked Content</h3>
        </header>
        <p>
          Thanks to our various filtration features, we can allow all sorts of content that many
          people might not want to see. For this to work, you need to correctly label your content.
          See <a href="/help#posting">the help section on posting</a> for more info.
        </p>
      </section>

      <section id="harassment">
        <header>
          <h3>Harassment</h3>
        </header>
        <p>
          Don't attempt to circumvent the Block feature or otherwise try to communicate with
          someone who has asked you to stop.
        </p>
      </section>

      <section id="privacy">
        <header>
          <h3>Respecting Privacy</h3>
        </header>
        <p>
          Don't share anyone's private information without their permission.
          It's a pretty mean thing to do.
        </p>
      </section>

      <section id="spamming">
        <header>
          <h3>Spamming</h3>
        </header>
        <p>
          If you're telling people about your cool project, that's cool. But if you exist for the
          sole purpose of advertising something else, then you're annoying and not adding any value
          to the community.
        </p>
      </section>

      <section id="impersonation">
        <header>
          <h3>Impersonation</h3>
        </header>
        <p>
          Don't pretend to be someone you're not. I don't mean this in the philisophical sense;
          literally don't claim to be a different person for the purpose of deceiving others.
        </p>
      </section>

      <section id="crack">
        <header>
          <h3>Cracking</h3>
        </header>
        <p>
          You can't talk about cracking, or as most people call it, hacking. This is DreamHost's
          rule, not mine, so I'm sorry if this upsets you. Note that they aren't very specific; as
          far as I'm concerned, it's only an issue if it's malicious in nature.
        </p>
      </section>
    </div>
  </Content>;
};
