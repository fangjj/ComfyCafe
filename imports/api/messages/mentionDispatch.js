import processMentions from "/imports/api/common/processMentions";

function mentionDispatch(messageId, data, topic, root, isComment) {
  if (! Meteor.isServer) {
    return;
  }

  let label;
  const doc = {
    message: {
      _id: messageId
    }
  };

  if (! isComment) {
    label = "topic";
    doc.topic = {
      _id: topic._id,
      name: topic.name,
      slug: topic.slug,
      room: {
        _id: topic.room._id,
        name: topic.room.name,
        slug: topic.room.slug
      }
    };
  } else {
    const mentionedMap = {
      post(item) {
        label = "postComment";
        doc.post = {
          _id: item._id,
          name: item.name,
          username: item.owner.username
        };
      }
    };
    mentionedMap[root[1]](root[0]);
  }

  processMentions(label, data.body, doc);
}

export default mentionDispatch;
