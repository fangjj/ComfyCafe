# TeruImages

WARNING: All users are assumed to be trusted.

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
