import _ from "lodash";
import GeoPattern from "geopattern";

import Posts from "../posts/collection";
import "../media/methods";

function logMigrate(body, note) {
  console.log("[MIGRATED] " + body + " (" + note + ")");
};

function migrationBuilder(functionBody) {
  return function () {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    if (Roles.userIsInRole(Meteor.userId(), ["admin"], Roles.GLOBAL_GROUP)) {
      if (Meteor.isServer) {
        functionBody();
      }
    } else {
      throw new Meteor.Error("not-authorized");
    }
  };
}

Meteor.methods({
  /*
  giveMeTheFuckingColors() {
    if (Meteor.isServer) {
      const colors = [];
      _.each(_.range(Math.pow(10, 6)), (i) => {
        console.log(i);
        const pattern = GeoPattern.generate(Random.id());
        colors.push(pattern.color);
      });
      const fs = require("fs");
      fs.writeFile("/home/teruko/colors.json", JSON.stringify(_.uniq(colors), null, 2));
    }
  },*/
  migrateColor: migrationBuilder(function () {
    Posts.find().map(function (post) {
      Meteor.call("mediumColor", post.medium._id._str);
      logMigrate(post.owner.username + "/" + post.name, "color");
    });
	})
});
