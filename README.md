# ComfyCafé

## What is it?

![](https://teru.sexy/gridfs/media/f9c366a3c50ae47b9379d8c1cc4e95d7.png?cache=2592000)

ComfyCafé is a site where you can upload images, tag images, like images, comment on images, filter images, and of course, report images for violating the rules.

There's more to the site than just images, but that's all you need to know to get started.

## Why is it?

As both an artist and funny picture enthusiast, I often find myself wanting to show people images. So I made a site designed for **convenient and robust image sharing**.

If you look at the \*booru-style image sites, you'll find that they have very good content categorization. You can easily find any image by any artist of any subject matter you like. The issue is that these sites tend to be highly specialized, and they also tend not to be socially-oriented, making them less suitable for content creators cultivating an audience.

On the other side of the story are sites like Tumblr, DeviantArt, etc. These sites give you the social tools you need for engaging your audience, but finding content tends to be difficult, as their tagging systems aren't as sophisticated as on \*booru-style sites.

ComfyCafé is designed to combine **content discovery** with **community cultivation**, thus **serving both creators and consumers**. In the interest of inclusivity and reaching as many people as possible, **anyone can use the site and upload images**, artist or otherwise.

## What else do you have?

- Images can be uploaded by **dragging and dropping anywhere**. Otherwise, you can simply click the floating action button, or even **paste to upload**.
- **Quirky image names** are generated randomly using a unique algorithm that totally isn't a ripoff of gfycat. Most notably, ComfyCafé has a much higher chance of generating sexy names than gfycat.
- **Advanced black magic** is used to generate background colors for images that best complement them, along with a nifty pattern. If you think you know better than the algorithm, you can also pick the color yourself.
- **Our tag system has the most depth** of any website I've ever seen. Tag definitions are centralized and **community-driven**, featuring aliases, implications, conditional implications, and extensions. Confused? Here's the [tutorial](todo).
- Create filters to **hide types of content you don't want to see**.
- All images have an assigned safety of either Safe, Risqué, Nudity, or Explicit. Searching to only get results within a subset of these is easy!
- You can **subscribe to other users**, and if you're feeling bold, you could even send a **friend request**.
- You can **use blogging features to keep your friends and fans in the loop**. Of course, most people will probably use it for shenanigans, including infinitely nestable reblogs.
- If you're feeling long-winded, you can **compose documents** with the Pages feature. This is ideal for tutorials, creative writing, and whatever else.
- Images can be collected into **cute little albums**.
- You can **comment on almost anything** on the site.
- Any user can **create a community**, which can then be home to all manner of **discussion topics**. Naturally, you can **govern and moderate your community as you see fit**.
- Use **direct messages** to communicate with people who you want to like you.
- **You can block annoying people**.
- All moderation actions are listed on a publicly readable log. This promotes **transparency and accountability**.

### Technical Stuff

- Thanks to Meteor being Meteor, all changes to content are displayed nearly instantly across all clients. No more reloading!
- Initial page loads are rendered on the server. This combines the first-paint speed and user convenience of SSR with the last-paint speed and developer convenience of client-side rendering.
- API coming soon!

## Built With

### [Meteor](https://www.meteor.com/)
An awesome framework made for awesome people by awesome people. Thanks to Meteor, it takes a lot less time to build web applications, which leaves me with plenty of time to weave humor into my README.

### [React](https://facebook.github.io/react/)
I used to have recurring nightmares about my view layer. Now I can successfully sleep at night 9 out of 10 times.

### Stuff that's still cool but isn't a framework
- [jdenticon](https://jdenticon.com/) for basically the best generated avatars ever.
- [GeoPattern](http://btmills.github.io/geopattern/) for generating the patterns that help make the site so comfy.
- [emojione](http://emojione.com) for the really aesthetic (and free) emoji. [CC-BY](http://creativecommons.org/licenses/by/4.0/) licensed.
- [Google's Material Design Icons](https://design.google.com/icons/) for being lovely and [CC-BY](https://creativecommons.org/licenses/by/4.0/)-licensed.
- [sharp](https://github.com/lovell/sharp) for resizing images really really fast.
- [everything made at Kadira](https://github.com/kadirahq) and by extension [Meteorhacks](https://github.com/meteorhacks) since they're responsible for so much great software in the Meteor ecosystem.
- [lodash](https://lodash.com/) for saving me an unquantifiable amount of time fiddling with JavaScript.
- [Material UI](https://github.com/callemall/material-ui) for having the prettiest text inputs around, among other things. Hopefully 0.16.0 will improve performance, since then I can bump them up higher on the list.
