KeepItOakland.town
===
SPA React built to a single minified combo JS/CSS tag for inclusion in Wordpress.

Adding Photos
---
All image files in the `src/static/photos` folder are automatically imported
for the carousel. They must be uploaded in wordpress under media during deployment, since
we build this app to minified js/css and can't include assets that way.

Updating Shops
---
1. Download the shop list as CSV
1. Convert to JSON
1. Paste JSON into `src/SHOPS.json`, overwriting the data there
1. Update shop coordinates thru Google's geocoding API so we can place the markers properly
    - `yarn start`
    - in the console at `localhost:3000`, run `updateShops(SHOPS)`
    - wait for it to finish, then copy the output and paste it into `src/SHOPS.json`
1. Manually fix neighborhood names (Temescale -> Temescal, Jack London Square -> Jack London, etc)

API Keys
---
Stored in a `.gitignore`d file in `src/KEYS.js`.

Deploying
---
`yarn build`, then manually replace `static/media/` with `wp-content/content/uploads/2019/11/` or whatever wordpress folder the images are uploaded in in `dist/build/static/js/bundle.min.js`.

Copy paste `dist/build/static/js/bundle.min.js` into a `<script type="text/javascript">` tag in wordpress.
