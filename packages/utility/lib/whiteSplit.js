whiteSplit = function (str) {
  // We don't need to compact this, since empty tokens should be impossible.
  return str.split(/\s+/);
};
