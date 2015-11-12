# Street View™ Embed Tool

Tool for generating `<iframe>` code of your custom panorama on Google Maps™.

Currently the Google Maps™ hasn't provided a way to get an embed HTML-code after the Google Maps Views™ service has been closed.

## How to use

- **Ctrl+C** the URL of panorama from address bar on Google Maps
- **Ctrl+V** it into the Embed Tool input field

## Outputs
You'll get two `<iframe>` outputs:
- The official way to embed Street View (documented but needs API Key)
- Undocumented way, based on putting the values into legacy code (may be stop working in future, but does not require API Key)

The first way is always preferred but the second one doesn't require extra movements.

## How it works
The Tool reads provided URL and extracts all neccessary data, such as lat/long, heading. pitch and zoom, then tries to get pano ID from given coordinates and translates all obtained data to ready-to-use `<iframe>` code.

For example, for the given URL:
https://www.google.com/maps/@39.7212024,21.634081,3a,73.4y,264.97h,87.54t/data=!3m8... (truncated for readability)
the main part is **@39.7212024,21.634081,3a,73.4y,264.97h,87.54t/**, and the rest is unneccessary.

#### More information on Google Developers Guide:
https://developers.google.com/maps/documentation/embed/guide#street_view_mode