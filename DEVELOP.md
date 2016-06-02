# Development

## Dependencies

- libvips 8.0.0+
- ffmpeg (tested with 2.8.4)
- GLIBCXX_3.4.21+

Oh, that last one? Yeah... you can check what you have via
```
cat /usr/lib/libstdc++.so | strings | grep ^GLIBCXX
```
You won't have 3.4.21 unless you also have GCC 5. To have that by default, you'd need something as new as Ubuntu 15.10 or Debian 9 (Stretch, current Testing).
