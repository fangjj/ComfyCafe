import tagParser from "./parser";
import { tagStringify } from "./stringify";

function tagRegenerator(parsed) {
  // Lazy, or genius? Time will decide!
  return tagParser(tagStringify(parsed));
}

export default tagRegenerator;
