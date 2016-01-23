# TeruImages

WARNING: All users are assumed to be trusted. This will change soon.

![](https://teru.sexy/gridfs/media/c121a4a8d5b9248786c8b4bf8425b44a)

New exciting dependencies:
- libvips 8.0.0+
- ImageMagick (tested with 6.9.2-10)
- ffmpeg (tested with 2.8.4)
- GLIBCXX_3.4.21+

Oh, that last one? Yeah... you can check what you have via
```
cat /usr/lib/libstdc++.so | strings | grep ^GLIBCXX
```
You won't have 3.4.21 unless you also have GCC 5. To have that by default, you'd need something as new as Ubuntu 15.10 or Debian 9 (Stretch, current Testing).
