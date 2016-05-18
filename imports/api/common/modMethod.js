import { isMod } from "/imports/api/common/persimmons";

function modMethod(func) {
  if (! Meteor.userId()) {
    throw new Meteor.Error("not-logged-in");
  }

  if (isMod(Meteor.userId())) {
    func();
  } else {
    throw new Meteor.Error("not-authorized");
  }
}

export default adminMethod;
