import _ from "lodash";

import Posts from "/imports/api/posts/collection";
import { regenThumbs } from "/imports/api/media/methods";
import adminMethod from "/imports/api/common/adminMethod";

Meteor.methods({
	adminRegenPostThumbs(postId) {
		check(postId, String);

		adminMethod(() => {
			const post = Posts.findOne({ _id: postId });
			regenThumbs(post.medium._id, () => true);
		});
	}
});
