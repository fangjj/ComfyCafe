// Publications
import "/imports/api/jobs/server/publications";
import "/imports/api/media/server/publications";
import "/imports/api/messages/server/publications";
import "/imports/api/modlog/server/publications";
import "/imports/api/notifications/server/publications";
import "/imports/api/posts/server/publications";
import "/imports/api/reports/server/publications";
import "/imports/api/rooms/server/publications";
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
import "/imports/api/users/server/birthdayReminder.js";

// Methods
import "/imports/api/media/methods";
import "/imports/api/media/adminMethods";
import "/imports/api/messages/methods";
import "/imports/api/migrations/methods";
import "/imports/api/notifications/methods";
import "/imports/api/posts/methods";
import "/imports/api/reports/methods";
import "/imports/api/topics/methods";
import "/imports/api/users/methods";
import "/imports/api/users/adminMethods";

// Startup
Session = { get() { return null; }, set() {} };
import "/imports/startup/server/startup";
import "/imports/startup/routes";
