# Street View™ Embed Tool

Tool for generating JavaScript code for embedding your panoramas on websites.

## How to use

- **Ctrl+C** the URL of panorama from address bar on Google Maps
- **Ctrl+V** it into the Embed Tool input field

## How it works
The Tool parses provided URL for panoID, lat/long, heading, pitch and zoom, and generates a ready-to-use HTML/JS code.

#### How can I get ID from URL:
The new panoID is located in `/data=...` segment starting from `-` and ending on first `!`. So for example URL:

`https://www.google.com/maps/@41.1385,-124.163335,3a,90y,292.61h,85.43t/data=!3m8!1e1!3m6!1s-KgDp6PbEdMc%2FVcfKospshpI%2FAAAAAAAACcc%2FpYJLwgd4tXk!2e4!3e11!6s`

the ID would be `F:-KgDp6PbEdMc/VcfKospshpI/AAAAAAAACcc/pYJLwgd4tXk` (with **F:-** prefix and **/** instead of **%2F**).

#### More info on Google Developers Documentation:
https://developers.google.com/maps/documentation/javascript/streetview
