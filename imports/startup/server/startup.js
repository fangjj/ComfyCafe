//import { Email } from "meteor/email";

Accounts.emailTemplates.from = "noreply@mail.teru.sexy";

Meteor.startup(function () {
  const timeInMillis = 1000 * 10; // 10 secs
  FlowRouter.setPageCacheTimeout(timeInMillis);
  FlowRouter.setDeferScriptLoading(true);

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
