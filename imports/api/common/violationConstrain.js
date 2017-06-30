import _ from "lodash";

const constrainMap = {
  user: [ "mistagged", "offtopic" ],
  image: [ "offtopic" ],
  message: [ "mistagged", "unsafe" ]
};

function violationConstrain(type) {
  return _.get(constrainMap, type, []);
}

export default violationConstrain;
