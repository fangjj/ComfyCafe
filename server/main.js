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

import "/imports/startup/routes";
