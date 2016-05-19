import violationMap from "/imports/api/common/violationMap";

const matchReason = {
  violation: Match.Where((v) => _.has(violationMap, v)),
  details: Match.Where((d) => (d.length > 0 || reason.violation !== "other"))
};

function checkReason(reason) {
  check(reason, matchReason);
}

export default checkReason;
