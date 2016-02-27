# ComfyCafé

WARNING: All users are assumed to be trusted. This will change soon.

![](https://teru.sexy/gridfs/media/b047e4c9480a128e65399cad74fccf83)

- Randomly generated funny post names
- Randomly generated colorful backgrounds
- Randomly generated stylish default avatars
- Randomly generated default chat room names that sometimes sound like actual social awareness organizations
- Randomly generated default existential topic titles

## Dependencies

- libvips 8.0.0+
- ImageMagick (tested with 6.9.2-10)
- ffmpeg (tested with 2.8.4)
- GLIBCXX_3.4.21+

Oh, that last one? Yeah... you can check what you have via
```
cat /usr/lib/libstdc++.so | strings | grep ^GLIBCXX
```
You won't have 3.4.21 unless you also have GCC 5. To have that by default, you'd need something as new as Ubuntu 15.10 or Debian 9 (Stretch, current Testing).

## Deployment

The included `deploy.sh` is a good starting point, assuming you have Ansible. As long as your server has GCC >=5, the Ansible playbook will take care of everything. Probably.
