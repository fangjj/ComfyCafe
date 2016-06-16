import React from "react";

import Content from "/imports/ui/components/Content";

export default () => {
  return <Content>
    <div className="textBody">
      <p>
        ComfyCafé is a site where you can upload images, tag images, like images, comment on images,
        filter images, and of course, report images for violating the rules.
      </p>
      <p>
        There's more to the site than just images, but that's all you need to know to get started.
      </p>
      <section id="why">
        <header>
          <h2>Why?</h2>
        </header>
        <p>
          As both an artist and funny picture enthusiast, I often find myself wanting to show
          people images. So I made a site designed for <strong>convenient and robust image sharing</strong>.
        </p>
        <p>
          If you look at booru-style image sites, you'll find that they have very good
          content categorization and permanence. You can easily find any image by any artist
          of any subject matter you like. The issue is that these sites tend to be
          highly specialized, and they also tend not to be socially-oriented, making them
          less suitable for content creators cultivating an audience.
        </p>
        <p>
          On the other side of the story are sites like Tumblr, DeviantArt, etc.
          These sites give you the social tools you need for engaging your audience,
          but finding content tends to be difficult, as their tagging systems aren't
          as sophisticated as on booru-style sites.
        </p>
        <p>
          ComfyCafé is designed to combine <strong>content discovery</strong>&nbsp;
          with <strong>community cultivation</strong>, thus serving both creators and consumers.
          In the interest of inclusivity and reaching as many people as possible,&nbsp;
          <strong>anyone can use the site and upload images</strong>, artist or otherwise.
        </p>
      </section>
      <section id="contact">
        <header>
          <h2>Contact</h2>
        </header>
        <p>
          Send questions, concerns, etc. to <a href='ma&#105;&#108;t&#111;&#58;adm%69n&#64;&#99;om&#102;&#37;79&#46;%&#54;3a%66e'>admin&#64;&#99;omfy&#46;&#99;afe</a>
        </p>
      </section>
    </div>
  </Content>;
};
