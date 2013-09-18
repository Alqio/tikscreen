Tikscreen
=========

Infoscreen for Tietokilta (CS Guild) guild room.

####Commands to CRON

Append _to_crontab.txt_ to your crontab and change directory if necessary.

Example:

    #fetches tapahtumat.html every 10 mins
    */10 * * * * wget -q -N -O ~/infoscreen/raw/tapahtumat.html http://tietokilta.fi/tapahtumat/

Bus stop info is currently fetched only manually. TODO: implement proper HSL-API calls.

####Running

Check that there's no screensaver or screen turnoff to be expected.

Open _index.html_ in Firefox (or other browser that allows reading local files). Stylesheet also currently optimized for _moz_.

Press F11 for fullscreen.