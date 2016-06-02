import _ from "lodash";

import toAbsolute from "/imports/ui/utils/toAbsolute";

function metaBuilder(data) {
  if (_.has(data, "title")) {
    DocHead.addMeta({ name: "og:title", content: data.title });
    DocHead.addMeta({ name: "twitter:title", content: data.title });
  }

  if (_.has(data, "description")) {
    DocHead.addMeta({ name: "description", content: data.description });
    DocHead.addMeta({ name: "og:description", content: data.description });
    DocHead.addMeta({ name: "twitter:description", content: data.description });
  }

  if (_.has(data, "image")) {
    DocHead.addMeta({ name: "og:image", content: toAbsolute(data.image("openGraph")) });
    DocHead.addMeta({ name: "twitter:image", content: toAbsolute(data.image("twitterCard")) });
    DocHead.addMeta({ name: "twitter:card", content: "summary_large_image" });
  }
}

export default metaBuilder;
