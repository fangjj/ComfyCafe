import { createContainer } from "meteor/react-meteor-data";

import PseudoBody from "./PseudoBody";

export default createContainer(({ params }) => {
  return {
    seed: Session.get("patternSeed")
  };
}, PseudoBody);
