let doneCallback = () => {};

Accounts.onResetPasswordLink(function (token, done) {
  Session.set("passwordResetToken", token);
  doneCallback = done;
});

export default doneCallback;
