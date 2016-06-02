import { isAdmin } from "/imports/api/common/persimmons";

function adminMethod(func) {
  if (! Meteor.userId()) {
    throw new Meteor.Error("not-logged-in");
  }

  if (isAdmin(Meteor.userId())) {
    func();
  } else {
    throw new Meteor.Error("not-authorized");
  }
}

export default adminMethod;
