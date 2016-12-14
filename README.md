Tikscreen
=========

Infoscreen for Tietokilta (CS Guild) guild room.

UPDATE 2017-01-01: lipsum


### Deployment

__DISCLAIMER: No warranties, etc.__

__Also, this is a locally-run demo solution intended to run client-only in a fresh browser dedicated to the infoscreen. The page makes calls to multiple providers, many without decent APIs or CORS headers. For serious production environments, do not run browser with same-origin security turned off.__

Start a simple HTTP server to serve files from tikscreen folder OR open _index.html_ directly in browser with access to local files and cross-origin security disabled.

Example in Chromium:

```
chromium-browser --disable-web-security --user-data-dir=<dir> --start-fullscreen index.html
```

The user-data-dir should be a new Chrome profile folder that is preferrably not used for anything else.