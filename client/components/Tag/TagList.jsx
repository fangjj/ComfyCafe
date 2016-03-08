TagList = React.createClass({
  render() {
    return <div className="content">
      <ul className="list">
        <li>leone</li>
      </ul>
    </div>;
  }
});

/*
- Include a live parsing preview

`fluttershy implies pink hair`
so then you type `fluttershy` in your tag editor box
and `fluttershy with pink hair` pops in
if you want to override `pink hair`, you just edit it or remove it.
Easy, right?

But we need to do some magic behind the scenes.
While it would be nice to call it a day and call this denormalization, what happens if the tag
changes? We'll need to update this denormalization. We need to keep track of what's overridden.

Let's say you change the hair color to green (weirdo)
`removed pink from hair`

Now, if we make the base change
`fluttershy implies long pink hair`
the tag set will be updated to
`fluttershy with long green hair`

Let's say you envision Fluttershy without hair (weirdo)
`removed hair`
So in the case of `fluttershy implies long pink hair and green eyes`, you'd get
`fluttershy with green eyes`

But wait, there's more!

`humanized fluttershy implies large breasts`
I bet you thought I'd come up with something more complex than that! Fortunately not...
So all you need to do is pop `humanized` in front of your Fluttershy, and suddenly you get large
breasts. Unfortunately, it's not that easy in real life...

But you're hungry. You want HIGHER-ORDER TAGS.
`flutterbat extends fluttershy implies bat wings, fangs, and red eyes`
(But isn't that just inheritance?) Shut up. It makes sense.
But I bet you're wondering what happens if you...
`humanized flutterbat`
Not only does it pull in any implications associated with `humanized flutterbat`, but also
implications for `humanized fluttershy`.

But you may have noticed that I've left out details. `red eyes` is overriding `green eyes`.
We'll simply use the same tag expansion system for this as we did before. We'll use it for the
aforementioned `humanized fluttershy` defintion, too.

Multiple inheritance isn't currently planned. If it becomes needed, it will be implemented.

We also need aliases, since anime is confusing.
`yoko-littner aka yoko, yoko-ritona`
`tengen-toppa-gurren-lagann aka ttgl, gurren-lagann`
These are resolved at parse time, and the tag suggester does a good job at helping you.

If we're going to stuff this much into our tags, we ought to keep track of stuff like series.
`yoko-littner from tengen-toppa-gurren-lagann`

We also have DYNAMIC TAGS. These tags aren't declared explicitly, but the tag system recognizes them.
`yoko-littner-cosplay` is a good example. However, it's a descriptor, not a noun.
`fluttershy with yoko-littner-cosplay`

While we've traditionally used the `with` keyword, you may have noticed that it's imperfect.
`fluttershy with pegasus` is semantically incorrect.
Alternatives:
`fluttershy: pegasus, long hair, large breasts`
Huh, I guess that works. Best of all, it makes semicolons not seem out of place.
What about without?
`fluttershy: pegasus, without hair, without eyes`
That works fine. Though, maybe you have a lot of withouts...
`fluttershy: pegasus, without (pink hair, green eyes)`
Which leaves us with the matter of places where without would be weird.
Between these...
`fluttershy: pegasus, not naked`
`not naked fluttershy: pegasus`
Well, that's not a contest. At all.
How are `without` and `not` different? `not` is adj-level. `without` is descriptor-level.
`long not pink hair` => long hair that isn't pink
`without long pink hair` => filter any posts containing long pink hair
So ultimately, is `without long pink hair` just shorthand for
`not long not pink hair`, or rather, `not (long, pink) hair?
Well, no. Since let's look at
`without hair`
This will exclude anything with any hair at all!
`not` tests for a descriptor that doesn't have a given adjective.
`without` tests for a tag set that doesn't have a matching descriptor.

The `girl with blue hat without red hat` problem
`girl: blue !red hat` (will nonprogrammers understand?)
`girl: blue not red hat` (explicit)
The second one is looking a lot better.

Let's not forget about the GLOBAL NAMESPACE.
`painting; by teruko; nsfw; fluttershy: blushing`

Oh? An interesting implication of the more rigid parsing?
`painting, flutterhy: blushing, large breasts, rarity: sparkles, glitter`
Yeah, we don't NEED semicolons.
`painting; fluttershy: blushing, large breasts; rarity: sparkles, glitter`
But semicolons are much more explicit, so we're sticking with them.
*/
