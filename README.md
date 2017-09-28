Tikscreen
=========

Infoscreen for Tietokilta (CS Guild) guild room.

*UPDATE 2017-09-28:*
Added merto terminal to bus stops list

*UPDATE 2016-12-21:* 
Switched to the new HSL GraphQL API, also UI updates & some refactoring


### Deployment

**These instructions describe a local demo solution intended to run client-only in a fresh browser dedicated to the infoscreen. The page makes calls to multiple providers, many without decent APIs or CORS headers. For serious production environments, do not run browser with same-origin security turned off.**

Start a simple HTTP server to serve files from tikscreen folder OR open _index.html_ directly in browser with access to local files and cross-origin security disabled.

Example in Chromium:

```
chromium-browser --disable-web-security --user-data-dir=<dir> --start-fullscreen index.html
```

The user-data-dir should be a new Chrome profile folder that is preferrably not used for anything else.

### License

No warranties, provided as-is, etc... Feel free to copy and use as you like, but please note possible terms and conditions of the APIs used! The guild website is also under copyright of Tietokilta ry.