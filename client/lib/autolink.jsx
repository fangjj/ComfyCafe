autolink = function (text) {
  let linked = [];
  const parts = text.split(urlRegex());
  if (parts.length > 1) {
    const urls = text.match(urlRegex());
    _.each(parts, (part, i) => {
      linked.push(parts[i]);
      if (! (urls.length < i)) {
        linked.push(<a href={urls[i]} rel="nofollow" key={_.uniqueId()}>{urls[i]}</a>);
      }
    });
  } else {
    linked = text;
  }
  return linked;
};
