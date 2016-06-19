# Help

## Markdown

Post descriptions, blog content, message bodies, and other such similarly lengthy and important text areas use [Markdown](http://commonmark.org/help/) for formatting. 

## Posting

Posting an image is easy! You can use the nice little (+) button in the bottom right, or just drag and drop an image to literally any part of any page. You can also paste images, but only in Chrome.

When I say images, I actually mean images (PNG, JPG, GIF), videos (MP4, WEBM, OGV), and audio (MP3, OGG) of up to 32MB.

You're given three visibility options: *Public*, *Friends only*, and *Unlisted*. Note that while this effects to whom posts are listed, anyone can still see any post if they have a link to it.

Originality is the next important choice. *Your work* is for things you made yourself, even if it's fanart or stuff like that. *Derivative work* is a little trickier; it's for things that you didn't entirely or necessarily create, but still aren't reposts. A good example of this is a screenshot, edited or otherwise. *Repost* is for stuff you didn't make and that came from somewhere else. In summary:
- *Your work* -> Made by you; came from you
- *Derivative work* -> Not made by you (full or in part); came from you
- *Repost* -> Not made by you; came from somewhere else

It's very important to select the correct safety for a post. Your choices are *Safe*, *Risqué*, *Nudity*, and *Explicit*, which I hope are easy to understand.
- *Safe* is for stuff that 4kids wouldn't have censored.
- *Risqué* is for stuff that has the potential to raise some eyebrows.
- *Nudity* is perhaps the most self-explanatory label.
- *Explicit* is for any sexual acts.

Last, but certainly not least, are tags. ComfyCafé sports a rather sophisticated tagging system that takes some figuring out. So much so that it's the subject of the entire next section!

## Tagging

While most sites tag content with simple lists of tags, ComfyCafé's approach is much more structured. Unfortunately, this results in more of a learning curve, but I have faith in your intelligence!

Let's look at an example tag set:
```
from tengen-toppa-gurren-lagann;
nia-teppelin: long multicolored hair, pink sundress, small breasts;
yoko-littner: long red ponytail, flame bikini, short denim shorts, large breasts
```
I've broken the example into multiple lines to make it easier to read, but that's not a requirement.

### Syntax

First off, let's cover syntax.

Note that spaces are used to separate tags; always use hyphens if a single tag consists of multiple words, lest strange things happen.

We'll call our main unit of organization a *clause*, since it's as good a word as any. Each line in the sample is a clause, and note how there's a semicolon at the end of each one. There isn't a semicolon at the end of the last one, since there's nothing after it to worry about separating from. But if you include one anyway, don't worry; the tag parser is fairly tolerant.

There are a few types of clauses. The most common type is the *subject clause*, which simply describes something in the picture, like a character. The 2nd and 3rd clauses in our example are subject clauses. The first clause in the example is an *origin clause*, which are denoted by the keyword `from`, and describe the source material of the image. There's also *author clauses*, which use the keyword `by`, and indicate who made the image. You don't need to use author clauses on your own work, since that works automatically.

For author and origin clauses, we've already covered everything. Subject clauses, however, go much deeper. It's possible to use a very simple subject clause, i.e. merely `nia-teppelin`. That's not very descriptive though, so we should add some descriptors. Descriptors are listed after the subject and a colon, and each descriptor is separated by a comma. The last tag in a descriptor is considered the noun, whereas the preceding tags modify that noun. A simple example would be `tall blue hat`. Thus, the subject clause `nia-teppelin: tall blue hat` would be taken to mean "this image contains Nia Teppelin, and she's wearing a tall blue hat".

Alright, now that you understand the basics, we can move on to the more complicated (and powerful) features.

### Abstractions

If you go to the [Tags](https://comfy.cafe/t) page, you have the ability to create and edit tags. Not *tag sets* as with posts, but the tags themselves. These definitions are centralized, so any contributions you make benefit the entire site!

From here, we can define various things that make tagging quicker and easier.

#### Aliases

Yoko Littner and Yoko Ritona are the same person, so we can use aliases to reflect that. If you set `yoko-ritona` as an alias on `yoko-littner`, whenever someone tags an image as Yoko Ritona, it will automatically be translated to Yoko Littner. Additionally, the alias will be factored into tag suggestions.

#### Origin

For characters, we already know the origin in advance, so we can simply enter it in and have it included automatically.

#### Extensions

People searching for `long red hair` likely also want results for `long red ponytail`. If you specify that `ponytail` extends `hair`, then this will work.

My favorite use of this is with animals. `lion` extends `cat` and `cat` extends `animal`. Therefore, searches for `animal ears` include `cat ears` and `lion ears`, along with any other animals that have been defined.

#### Implications

It's a well established fact that Yoko Littner has a long red ponytail and large breasts, so why should you waste time marking that each time? Thanks to tag implications, you only need to do it once.

When defining implications, all you need to do is put in a list of descriptors, i.e. `long red ponytail, large breasts`. After doing that, any images that have Yoko Littner as a subject will automatically have these descriptors merged in. Naturally, if these descriptors aren't apt in a given case, they can be easily overridden for that image simply by editing its tag set.

If you want to test how merging works, you can use the handy [Tag Test](https://comfy.cafe/tag-test). *Tags A* represents the starting implication value (before editing implications). *Tags B* represents the ending implication value (after editing implications). *Tags C* represents a tag set on an image. The tag tree displayed at the top shows the merged result.

We do our best to make implication merging intelligent, but given the complexity, problems can happen. If you see anything funny, be sure to report it.

#### Conditional Implications

Conditional implications are just like regular implications, except they're only applied if the specified condition is satisfied.

Presently, only one type of condition exists: the presence of a noun in the subject's descriptors. An example of a valid condition would be `young`, which would then trigger for `nia-teppelin: young`.

## Searching

Searching uses the same tag system, so most of what you already know carries over. However, there are some additions.

Author and origin clauses can be inverted using the keyword `not`, i.e. `not by` and `not from`. Instead of showing only images from something, this will exclude all images from something.

There are *name clauses*, which use the keyword `name` and search by image name. This isn't particularly useful, but hey, you can use it.

Much more useful is the *safety clause*, which uses the keyword `safety` and allows you to search by safety, or a range of safeties. For convenience, there are multiple ways to indicate which safeties you want:
- Safe: `0`, `s`, `safe`
- Risqué: `1`, `r`, `risqué`, `risque`
- Nudity: `2`, `n`, `nudity`
- Explicit: `3`, `e`, `explicit`

You can search for a single safety, i.e. `safety s`, or for a range of safeties, like `safety s-n`.

You have several ways to exclude things within subject clauses. To exclude an entire subject, you can prefix the subject with either `not` or `without`, i.e. `without nia-teppelin`, which does what you expect it to. If you want pictures of Nia Teppelin, but really don't like small breasts, you would use `nia-teppelin: without small breasts`. This is descriptor-level exclusion, and as with subject-level exclusion, you can use `not` and `without` interchangeably.

If you want a few different things, but don't particularly care about getting them all at once, we have the `or` keyword. Or for the more technically minded, `||`; it does the same thing either way. However, you can only this at top-level, i.e.:
`nia-teppelin: sundress || yoko-littner: denim shorts`
