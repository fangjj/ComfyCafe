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
        <li><a href="#illegal">Illegal Content</a></li>
        <li><a href="#copyright">Copyright Infringement</a></li>
        <li><a href="#miscategorization">Mismarked Content</a></li>
        <li><a href="#impersonation">Impersonation</a></li>
        <li><a href="#respect">Respect Boundaries</a></li>
        <li><a href="#disruption">Technological Disruption</a></li>
        <li><a href="#spam">Spam</a></li>
        <li><a href="#interpretation">Interpretation and Enforcement</a></li>
      </ul>

      <br />
      <p>
        Here at ComfyCafé, we pride ourselves in maintaining a higher standard of free speech than our competition. However, in order to assure that we can continue to provide this platform, we must adhere to United States law. Additionally, various quality of life concerns are taken into consideration; most notably, spam isn't allowed.
      </p>

      <section id="illegal">
        <header>
          <h3>Illegal Content</h3>
        </header>
        <p>
          You may not use ComfyCafé to conduct any activity that is illegal in the United States of America. This includes (but isn't limited to) posting illegal content, linking to illegal content, and requesting illegal content.
        </p>
      </section>

      <section id="copyright">
        <header>
          <h3>Copyright Infringement</h3>
        </header>
        <p>
          You may only post content to ComfyCafé that you either A) hold the copyright to, or B) have appropriate license to post. As such, by posting content, you assert that you can legally post said content.
        </p>
      </section>

      <section id="miscategorization">
        <header>
          <h3>Deceptive Miscategorization</h3>
        </header>
        <p>
          Do not intentionally give a post incorrect tags for the purpose of bypassing filters or "expanding your audience". By extension, this includes incorrectly marking the safety or originality of a post.
        </p>
        <p>
          For more guidance, reference the <a href="/help#posting">Posting Help</a> text.
        </p>
      </section>

      <section id="impersonation">
        <header>
          <h3>Impersonation</h3>
        </header>
        <p>
          Do not claim to be an individual (or organization) that you're not with the intention of deceiving others. Doing so for comedic or entertainment purposes is acceptable.
        </p>
      </section>

      <section id="respect">
        <header>
          <h3>Respect Boundaries</h3>
        </header>
        <p>
          Do not post someone's private information without their consent.
        </p>
        <p>
          If a user blocks you, do not attempt to circumvent the block.
        </p>
      </section>

      <section id="disruption">
        <header>
          <h3>Technological Disruption</h3>
        </header>
        <p>
          Don't do anything to intentionally disrupt the functionality of ComfyCafé or otherwise negatively impact the ability of users to access the site.
        </p>
        <p>
          Do not use ComfyCafé to link to or distribute viruses, malware, or other forms of malicious software or code.
        </p>
        <p>
          You may not use ComfyCafé for the discussion of malicious hacking activities, nor for the distribution or linking of tools for that purpose.
        </p>
      </section>

      <section id="spam">
        <header>
          <h3>Spam</h3>
        </header>
        <p>
          You know what spam is.
        </p>
      </section>

      <section id="interpretation">
        <header>
          <h3>Interpretation and Enforcement</h3>
        </header>
        <p>
          The above are simply guidelines, and are not exhaustive. Both the guidelines and the circumstances of individual violations are open to interpretation by the ComfyCafé administration and moderators. If that sounds sketchy to you, then you can enjoy the transparency and accountability of our <a href="/modlog">Moderation Log</a>. If you suspect power abuse by a moderator, you're encouraged to go over their head by emailing <a href='ma&#105;&#108;t&#111;&#58;adm%69n&#64;&#99;om&#102;&#37;79&#46;%&#54;3a%66e'>admin&#64;&#99;omfy&#46;&#99;afe</a>. If you suspect the admin is abusing his power, then the recommended course of action is to assemble the Seven Sages and seal the admin in the Sacred Realm. However, he will invariably rise again.
        </p>
        <p>
          The guidelines may also change as the realities of online communities unfold. Nontrivial changes will be announced in the relevant ComfyCafé discussion community, and in the event of any major changes, all users will be notified via email.
        </p>
        <p>
          If you believe a user has violated either these guidelines or the greater <a href="/legal">Terms of Service</a>, either A) use the site's built-in report feature (preferred), or B) send an email to <a href='ma&#105;&#108;t&#111;&#58;adm%69n&#64;&#99;om&#102;&#37;79&#46;%&#54;3a%66e'>admin&#64;&#99;omfy&#46;&#99;afe</a>.
        </p>
      </section>
    </div>
  </Content>;
};
