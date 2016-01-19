User = Astro.Class({
  name: "User",
  collection: Meteor.users,
  transform: false,
  fields: {
    username: "string",
    emails: "array",
    services: "object",
    createdAt: "date",
    profile: {
      type: "object",
      default: function () {
        return {};
      }
    }
  }
});
