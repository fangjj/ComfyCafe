import Posts from "../posts/collection";
import Rooms from "../rooms/collection";
import Topics from "../topics/collection";
import Messages from "../messages/collection";
import Notifications from "../notifications/collection";

export default {
  user: Meteor.users,
  image: Posts,
  community: Rooms,
  topic: Topics,
  message: Messages,
  notification: Notifications
};
