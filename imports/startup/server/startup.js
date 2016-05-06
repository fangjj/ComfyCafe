//import { Email } from "meteor/email";

Meteor.startup(function () {
  if (process.env.NODE_ENV === "production") {
    process.on("uncaughtException", function (er) {
      console.error(er.stack);
      /*
      Email.send({
        from: "noreply@comfy.cafe",
        to: "admin@comfy.cafe",
        subject: er.message,
        text: er.stack
      });*/
    });
  }
});
