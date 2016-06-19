import React from "react";

import Content from "/imports/ui/components/Content";

export default () => {
  return <Content>
    <div className="textBody">
      <header>
        <h2>Help</h2>
      </header>

      <section id="markdown">
        <header>
          <h3>Markdown</h3>
        </header>

        <p>
          Post descriptions, blog content, message bodies, and other such similarly lengthy and important text areas use <a href="http://commonmark.org/help/">Markdown</a> for formatting.
        </p>
      </section>

      <section id="posting">
        <header>
          <h3>Posting</h3>
        </header>

        <p>
          Posting an image is easy! You can use the nice little (+) button in the bottom right, or just drag and drop an image to literally any part of any page. You can also paste images, but only in Chrome.
        </p>
        <p>
          When I say images, I actually mean images (PNG, JPG, GIF), videos (MP4, WEBM, OGV), and audio (MP3, OGG) of up to 32MB.
        </p>
        <p>
          We allow most types of content, but if in doubt, be sure to reference the <a href="/guidelines">Community Guidelines</a>.
        </p>
        <p>
          You&#39;re given three visibility options: <em>Public</em>, <em>Friends only</em>, and <em>Unlisted</em>. Note that while this effects to whom posts are listed, anyone can still see any post if they have a link to it.
        </p>
        <p>
          Originality is the next important choice. <em>Your work</em> is for things you made yourself, even if it's fanart or stuff like that. <em>Derivative work</em> is a little trickier; it's for things that you didn't entirely or necessarily create, but still aren't reposts. A good example of this is a screenshot, edited or otherwise. <em>Repost</em> is for stuff you didn&#39;t make and that came from somewhere else. In summary:
        </p>
        <ul>
          <li><em>Your work</em> -> Made by you; came from you</li>
          <li><em>Derivative work</em> -> Not made by you (full or in part); came from you</li>
          <li><em>Repost</em> -> Not made by you; came from somewhere else</li>
        </ul>
        <br />

        <p>
          It&#39;s very important to select the correct safety for a post. Your choices are <em>Safe</em>, <em>Risqué</em>, <em>Nudity</em>, and <em>Explicit</em>, which I hope are easy to understand.
        </p>
        <ul>
          <li><em>Safe</em> is for stuff that 4kids wouldn&#39;t have censored.</li>
          <li><em>Risqué</em> is for stuff that has the potential to raise some eyebrows.</li>
          <li><em>Nudity</em> is perhaps the most self-explanatory label.</li>
          <li><em>Explicit</em> is for any sexual acts.</li>
        </ul>
        <br />

        <p>
          Last, but certainly not least, are tags. ComfyCafé sports a rather sophisticated tagging system that takes some figuring out. So much so that it&#39;s the subject of the entire next section!
        </p>
      </section>

      <section id="tagging">
        <header>
          <h3>Tagging</h3>
        </header>

        <p>
          While most sites tag content with simple lists of tags, ComfyCafé&#39;s approach is much more structured. Unfortunately, this results in more of a learning curve, but I have faith in your intelligence!
        </p>
        <p>
          Let&#39;s look at an example tag set:
        </p>
        <pre><code>
          from tengen-toppa-gurren-lagann;<br />
          nia-teppelin: long multicolored hair, pink sundress, small breasts;<br />
          yoko-littner: long red ponytail, flame bikini, short denim shorts, large breasts
        </code></pre>
        <p>
          I've broken the example into multiple lines to make it easier to read, but that's not a requirement.
        </p>

        <section id="syntax">
          <header>
            <h4>Syntax</h4>
          </header>

          <p>
            First off, let&#39;s cover syntax.
          </p>
          <p>
            Note that spaces are used to separate tags; always use hyphens if a single tag consists of multiple words, lest strange things happen.
          </p>
          <p>
            We'll call our main unit of organization a <em>clause</em>, since it's as good a word as any. Each line in the sample is a clause, and note how there's a semicolon at the end of each one. There isn't a semicolon at the end of the last one, since there's nothing after it to worry about separating from. But if you include one anyway, don't worry; the tag parser is fairly tolerant.
          </p>
          <p>
            There are a few types of clauses. The most common type is the <em>subject clause</em>, which simply describes something in the picture, like a character. The 2nd and 3rd clauses in our example are subject clauses. The first clause in the example is an <em>origin clause</em>, which are denoted by the keyword <span className="snippet">from</span>, and describe the source material of the image. There's also <em>author clauses</em>, which use the keyword <span className="snippet">by</span>, and indicate who made the image. You don't need to use author clauses on your own work, since that works automatically.
          </p>
          <p>
            For author and origin clauses, we've already covered everything. Subject clauses, however, go much deeper. It's possible to use a very simple subject clause, i.e. merely <span className="snippet">nia-teppelin</span>. That's not very descriptive though, so we should add some descriptors. Descriptors are listed after the subject and a colon, and each descriptor is separated by a comma. The last tag in a descriptor is considered the noun, whereas the preceding tags modify that noun. A simple example would be <span className="snippet">tall blue hat</span>. Thus, the subject clause <span className="snippet">nia-teppelin: tall blue hat</span> would be taken to mean "this image contains Nia Teppelin, and she's wearing a tall blue hat&quot;.
          </p>
          <p>
            Alright, now that you understand the basics, we can move on to the more complicated (and powerful) features.
          </p>
        </section>

        <section id="abstractions">
          <header>
            <h4>Abstractions</h4>
          </header>

          <p>
            If you go to the <a href="/t">Tags</a> page, you have the ability to create and edit tags. Not <em>tag sets</em> as with posts, but the tags themselves. These definitions are centralized, so any contributions you make benefit the entire site!
          </p>
          <p>
            From here, we can define various things that make tagging quicker and easier.
          </p>

          <section id="aliases">
            <header>
              <h5>Aliases</h5>
            </header>

            <p>
              Yoko Littner and Yoko Ritona are the same person, so we can use aliases to reflect that. If you set <span className="snippet">yoko-ritona</span> as an alias on <span className="snippet">yoko-littner</span>, whenever someone tags an image as Yoko Ritona, it will automatically be translated to Yoko Littner. Additionally, the alias will be factored into tag suggestions.
            </p>
          </section>

          <section id="origin">
            <header>
              <h5>Origin</h5>
            </header>

            <p>
              For characters, we already know the origin in advance, so we can simply enter it in and have it included automatically.
            </p>
          </section>

          <section id="extensions">
            <header>
              <h5>Extensions</h5>
            </header>

            <p>
              People searching for <span className="snippet">long red hair</span> likely also want results for <span className="snippet">long red ponytail</span>. If you specify that <span className="snippet">ponytail</span> extends <span className="snippet">hair</span>, then this will work.
            </p>
            <p>
              My favorite use of this is with animals. <span className="snippet">lion</span> extends <span className="snippet">cat</span> and <span className="snippet">cat</span> extends <span className="snippet">animal</span>. Therefore, searches for <span className="snippet">animal ears</span> include <span className="snippet">cat ears</span> and <span className="snippet">lion ears</span>, along with any other animals that have been defined.
            </p>
          </section>

          <section id="implications">
            <header>
              <h5>Implications</h5>
            </header>

            <p>
              It&#39;s a well established fact that Yoko Littner has a long red ponytail and large breasts, so why should you waste time marking that each time? Thanks to tag implications, you only need to do it once.
            </p>
            <p>
              When defining implications, all you need to do is put in a list of descriptors, i.e. <span className="snippet">long red ponytail, large breasts</span>. After doing that, any images that have Yoko Littner as a subject will automatically have these descriptors merged in. Naturally, if these descriptors aren&#39;t apt in a given case, they can be easily overridden for that image simply by editing its tag set.
            </p>
            <p>
              If you want to test how merging works, you can use the handy <a href="/tag-test">Tag Test</a>. <em>Tags A</em> represents the starting implication value (before editing implications). <em>Tags B</em> represents the ending implication value (after editing implications). <em>Tags C</em> represents a tag set on an image. The tag tree displayed at the top shows the merged result.
            </p>
            <p>
              We do our best to make implication merging intelligent, but given the complexity, problems can happen. If you see anything funny, be sure to report it.
            </p>
          </section>

          <section id="condimpls">
            <header>
              <h5>Conditional Implications</h5>
            </header>

            <p>
              Conditional implications are just like regular implications, except they&#39;re only applied if the specified condition is satisfied.
            </p>
            <p>
              Presently, only one type of condition exists: the presence of a noun in the subject&#39;s descriptors. An example of a valid condition would be <span className="snippet">young</span>, which would then trigger for <span className="snippet">nia-teppelin: young</span>.
            </p>
          </section>
        </section>
      </section>

      <section id="searching">
        <header>
          <h3>Searching</h3>
        </header>

        <p>
          Searching uses the same tag system, so most of what you already know carries over. However, there are some additions.
        </p>
        <p>
          Author and origin clauses can be inverted using the keyword <span className="snippet">not</span>, i.e. <span className="snippet">not by</span> and <span className="snippet">not from</span>. Instead of showing only images from something, this will exclude all images from something.
        </p>
        <p>
          There are <em>name clauses</em>, which use the keyword <span className="snippet">name</span> and search by image name. This isn&#39;t particularly useful, but hey, you can use it.
        </p>
        <p>
          Much more useful is the <em>safety clause</em>, which uses the keyword <span className="snippet">safety</span> and allows you to search by safety, or a range of safeties. For convenience, there are multiple ways to indicate which safeties you want:
        </p>
        <ul>
          <li>Safe: <span className="snippet">0</span>, <span className="snippet">s</span>, <span className="snippet">safe</span></li>
          <li>Risqué: <span className="snippet">1</span>, <span className="snippet">r</span>, <span className="snippet">risqué</span>, <span className="snippet">risque</span></li>
          <li>Nudity: <span className="snippet">2</span>, <span className="snippet">n</span>, <span className="snippet">nudity</span></li>
          <li>Explicit: <span className="snippet">3</span>, <span className="snippet">e</span>, <span className="snippet">explicit</span></li>
        </ul>
        <br />
        <p>
          You can search for a single safety, i.e. <span className="snippet">safety s</span>, or for a range of safeties, like <span className="snippet">safety s-n</span>.
        </p>
        <p>
          You have several ways to exclude things within subject clauses. To exclude an entire subject, you can prefix the subject with either <span className="snippet">not</span> or <span className="snippet">without</span>, i.e. <span className="snippet">without nia-teppelin</span>, which does what you expect it to. If you want pictures of Nia Teppelin, but really don&#39;t like small breasts, you would use <span className="snippet">nia-teppelin: without small breasts</span>. This is descriptor-level exclusion, and as with subject-level exclusion, you can use <span className="snippet">not</span> and <span className="snippet">without</span> interchangeably.
        </p>
        <p>
          If you want a few different things, but don&#39;t particularly care about getting them all at once, we have the <span className="snippet">or</span> keyword. Or for the more technically minded, <span className="snippet">||</span>; it does the same thing either way. However, you can only this at top-level, i.e.:
          <span className="snippet">nia-teppelin: sundress || yoko-littner: denim shorts</span>
        </p>
      </section>
    </div>
  </Content>;
};
