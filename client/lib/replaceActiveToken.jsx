replaceActiveToken = function (value, replacement, tf) {
  const searchPair = getActiveToken(value, tf);

  const before = value.substr(0, searchPair[1]);
  const after = value.substr(searchPair[1] + searchPair[0].length);

  const text = before + replacement + after;

  const needle = text.length - after.length;

  return {
    text: text,
    needle: needle,
    moveNeedle() {
      tf.selectionStart = needle;
      tf.selectionEnd = needle;
    }
  };
};
