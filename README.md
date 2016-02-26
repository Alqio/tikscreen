Tikscreen
=========

Infoscreen for Tietokilta (CS Guild) guild room.

UPDATE 2016-02-26: HSL API has changed and/or my API keys have expired so bus stop info longer works


### Deployment

__DISCLAIMER: No warranties, etc.__

__Also, these instructions describe a demo / client-only / very-lightweight-local-http-server solution intended to run on a browser doing nothing else than running the infoscreen. The page makes calls to multiple providers, many without decent APIs or CORS headers. For serious production environments, do not run browser with same-origin security turned off.__

1. Check that you have HSL api keys in _hslaccount.json_ (the file has been gitignored) in the same folder as _index.html_.

2. Start a simple HTTP server to serve files from tikscreen folder or open _index.html_ directly in browser with cross-origin security disabled.

```
google-chrome --disable-web-security
```

3. Press F11 for fullscreen.