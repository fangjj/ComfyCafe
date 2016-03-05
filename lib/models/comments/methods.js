Meteor.methods({
  addComment: function (postId, data) {
    check(postId, String);
    check(data, {
      body: String
    });

    if (! Meteor.userId()) {
      throw new Meteor.Error("not-logged-in");
    }

    var commentId = Comments.insert({
      createdAt: new Date(),
      updatedAt: new Date(),
      body: data.body,
      owner: {
        _id: Meteor.userId(),
        username: Meteor.user().username,
        profile: Meteor.user().profile
      },
      post: {
        _id: postId
      }
    });

    if (Meteor.isServer) {
      var post = Posts.findOne({ _id: postId });
      processMentions("comment", data.body, {
        comment: {
          _id: commentId
        },
        post: {
          _id: post._id,
          name: post.name
        }
      });
    }
  },
  updateComment: function (commentId, data) {
    check(commentId, String);
    check(data, {
      body: String
    });

    var comment = Comments.findOne(commentId);

    if (comment.owner._id !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

    Comments.update(
      { _id: commentId },
      { $set: {
        updatedAt: new Date(),
        body: data.body
      } }
    );

    if (Meteor.isServer) {
      var post = Posts.findOne({ _id: comment.post._id });
      processMentions("comment", data.body, {
        comment: {
          _id: commentId
        },
        post: {
          _id: post._id,
          name: post.name
        }
      });
    }
  },
  deleteComment: function (commentId) {
    check(commentId, String);

    var msg = Comments.findOne(commentId);

    if (comment.owner._id !== Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

    Comments.remove(commentId);
  }
});
