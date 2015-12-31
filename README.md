# TeruImages

WARNING: All users are assumed to be trusted.

Users of Amazon's S3 would likely prefer to use lepozepo:s3 over teruko:s3, as the latter is oriented towards DreamHost/Ceph. The API is the same (as is 98% of the source), so it's a drop-in replacement.

```
meteor remove teruko:s3
meteor add lepozepo:s3
```

S3 configuration is of the following format:

```
"s3": {
  "host": "objects.dreamhost.com",
  "key": "YourAccessKey",
  "secret": "YourSuperSecretKey",
  "bucket": "YourBucketName"
}
```

This works for either S3 implementation, though lepozepo:s3 will ignore the host field. These settings must be set via [Meteor.settings](http://docs.meteor.com/#/full/meteor_settings), which typically involves either a settings.json file or an environment variable.
