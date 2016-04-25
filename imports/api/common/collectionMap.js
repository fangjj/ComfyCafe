import Posts from "../posts/collection";
import Albums from "../albums/collection";
import Pages from "../pages/collection";
import BlogPosts from "../blog/collection";
import Rooms from "../rooms/collection";
import Topics from "../topics/collection";
import Messages from "../messages/collection";
import Tags from "../tags/collection";
import Badges from "../badges/collection";
import Notifications from "../notifications/collection";

export default {
  user: Meteor.users,
  post: Posts,
  album: Albums,
  page: Pages,
  blog: BlogPosts,
  room: Rooms,
  topic: Topics,
  message: Messages,
  tag: Tags,
  badge: Badges,
  notification: Notifications
};
