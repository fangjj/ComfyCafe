getActiveToken = function (value, tf) {
  const tokens = fancySplit(value);
  // we have our lovely needle
  const needle = tf.selectionStart;
  // now find what token needle touches
  // needle touches token if...
  // - needle is at start of token
  // - needle is in token
  // - needle is at end of token
  return _.find(tokens, (pair, index) => {
    const token = pair[0];
    const offset = pair[1];
    return _.inRange(needle, offset, offset + token.length + 1); // [start, end)
  });
};
