import _ from "lodash";

import media from "/imports/api/media/collection";
import { regenThumbs } from "/imports/api/media/methods";
import adminMethod from "/imports/api/common/adminMethod";

Meteor.methods({
	adminRegenThumbs(policyName) {
    check(policyName, String);
		adminMethod(() => {
			media.find(
        {
          "metadata.thumbnailPolicy": policyName,
          "metadata.complete": true
        }
      ).map((medium) => {
        regenThumbs(medium._id, () => true);
      });
		});
	}
});
