import Posts from "../posts/collection";
import Albums from "../albums/collection";
import Pages from "../pages/collection";
import BlogPosts from "../blog/collection";
import Rooms from "../rooms/collection";
import Topics from "../topics/collection";
import Messages from "../messages/collection";
import Tags from "../tags/collection";
import Filters from "../filters/collection";
import Badges from "../badges/collection";
import Notifications from "../notifications/collection";

export default {
  user: Meteor.users,
  image: Posts,
  blog: BlogPosts,
  page: Pages,
  album: Albums,
  community: Rooms,
  topic: Topics,
  message: Messages,
  tag: Tags,
  filter: Filters,
  badge: Badges,
  notification: Notifications
};
