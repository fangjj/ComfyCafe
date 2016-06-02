import _ from "lodash";

const constrainMap = {
  user: [ "mistagged", "offtopic" ],
  image: [ "offtopic" ],
  blog: [ "mistagged", "unsafe", "offtopic" ],
  page: [ "mistagged", "unsafe", "offtopic" ],
  album: [ "mistagged", "unsafe", "offtopic" ],
  community: [ "mistagged", "unsafe", "offtopic" ],
  topic: [ "mistagged", "unsafe" ],
  message: [ "mistagged", "unsafe" ]
};

function violationConstrain(type) {
  return _.get(constrainMap, type, []);
}

export default violationConstrain;
