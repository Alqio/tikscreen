Tikscreen
=========

Infoscreen for Tietokilta (CS Guild) guild room.

*UPDATE 2017-01-01:* 
Fetch bus timetables from new HSL API (Digitransit), UI updates & some refactoring


### Deployment

**These instructions describe a local demo solution intended to run client-only in a fresh browser dedicated to the infoscreen. The page makes calls to multiple providers, many without decent APIs or CORS headers. For serious production environments, do not run browser with same-origin security turned off.**

Start a simple HTTP server to serve files from tikscreen folder OR open _index.html_ directly in browser with access to local files and cross-origin security disabled.

Example in Chromium:

```
chromium-browser --disable-web-security --user-data-dir=<dir> --start-fullscreen index.html
```

The user-data-dir should be a new Chrome profile folder that is preferrably not used for anything else.

### License

No warranties, provided as-is, etc... Feel free to copy and use as you like, but please adhere to possible terms of the third-party APIs! The guild website is also under copyright of Tietokilta ry.