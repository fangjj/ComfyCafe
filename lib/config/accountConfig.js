AccountsTemplates.configure({
  // Flow Router
  defaultLayoutType: "blaze",
  defaultTemplate: "fullPageAtForm",
  defaultLayout: "layout",
  defaultLayoutRegions: {},
  defaultContentRegion: "content",

  // Behavior
  confirmPassword: true,
  enablePasswordChange: true,
  forbidClientAccountCreation: false,
  overrideLoginErrors: true,
  sendVerificationEmail: false,
  lowercaseUsername: false,

  // Appearance
  showAddRemoveServices: false,
  showForgotPasswordLink: true,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: false,

  // Client-side Validation
  continuousValidation: false,
  negativeFeedback: false,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,

  // Privacy Policy and Terms of Use
  privacyUrl: "privacy",
  termsUrl: "terms-of-use",

  // Redirects
  homeRoutePath: "/",
  redirectTimeout: 4000,

  // Hooks
  onLogoutHook: function () {},
  onSubmitHook: function () {},
  preSignUpHook: function () {},

  // Texts
  texts: {
    button: {
      signUp: "Register Now!"
    },
    socialSignUp: "Register",
    socialIcons: {
      "meteor-developer": "fa fa-rocket"
    },
    title: {
      forgotPwd: "Recover Your Password"
    },
  },
});

var pwd = AccountsTemplates.removeField("password");
AccountsTemplates.removeField("email");
AccountsTemplates.addFields([
  {
    _id: "key",
    type: "text",
    required: true,
    displayName: "Key"
  },
  {
    _id: "email",
    type: "email",
    required: true,
    displayName: "email",
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: "Invalid email",
  },
  {
    _id: "username",
    type: "text",
    displayName: "username",
    required: true,
    minLength: 1,
  },
  pwd
]);
