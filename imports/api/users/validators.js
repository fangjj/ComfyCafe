import isEmail from "validator/lib/isEmail";

function validateUsername(username) {
  return ! Boolean(username.match(/\s+/));
}

function validateEmail(email) {
  return isEmail(email);
}

export {
  validateUsername,
  validateEmail
};
