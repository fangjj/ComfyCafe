Invites = new Mongo.Collection("invites");
Invite = Astro.Class({
  name: "Invite",
  collection: Invites,
  fields: {
    key: {
      type: "string"
    },
    uploader: {
      type: "string"
    }
  }
});
