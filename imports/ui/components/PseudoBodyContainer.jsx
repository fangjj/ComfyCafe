import { createContainer } from "meteor/react-meteor-data";

import PseudoBody from "./PseudoBody";

export default createContainer(({ params }) => {
  console.log(Session);
  return {
    seed: Session.get("patternSeed"),
    color: Session.get("patternColor")
  };
}, PseudoBody);
