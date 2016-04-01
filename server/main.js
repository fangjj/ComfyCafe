// Publications
import "/imports/api/blog/server/publications";
import "/imports/api/invites/server/publications";
import "/imports/api/jobs/server/publications";
import "/imports/api/media/server/publications";
import "/imports/api/messages/server/publications";
import "/imports/api/notifications/server/publications";
import "/imports/api/posts/server/publications";
import "/imports/api/rooms/server/publications";
import "/imports/api/tags/server/publications";
import "/imports/api/topics/server/publications";
import "/imports/api/users/server/publications";

// Security
import "/imports/api/jobs/server/security";
import "/imports/api/media/server/security";
import "/imports/api/users/server/security";

// Config
import "/imports/api/jobs/server/config";
import "/imports/api/users/server/registration";

// Workers
import "/imports/api/jobs/server/garbageCollection.js";
import "/imports/api/thumbnails/server/job.js";

// Methods
import "/imports/api/blog/methods";
import "/imports/api/invites/methods";
import "/imports/api/media/methods";
import "/imports/api/messages/methods";
import "/imports/api/notifications/methods";
import "/imports/api/posts/methods";
import "/imports/api/rooms/methods";
import "/imports/api/tags/methods";
import "/imports/api/topics/methods";
import "/imports/api/users/methods";

// Startup
import "/imports/startup/server/startup";
import "/imports/startup/routes";
