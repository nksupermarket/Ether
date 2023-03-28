# Ether - an aesthetic, functional startpage

I was tired of having to press so many buttons to get to where I wanted to go so I built this start page.
Navigate to your favorite sites with just a keypress or start a search with the Shift key.

## Pre-configured themes

Swap out the colors or the image if they're not to your liking. Here are some pre-configured themes to get you started.

Everforest dark
![Ether - Everforest dark theme](https://i.postimg.cc/dQ6sSBZM/ether-everforest-dark.jpg)

Everforest light
![Ether - Everforest light theme](https://i.postimg.cc/Y9k7dGpq/ether-everforest-light.jpg)

Catppuccin
![Ether - Catppuccin theme](https://i.postimg.cc/Z5G4ys2N/ether-catppuccin.jpg)

Dracula
![Ether - Dracula theme](https://i.postimg.cc/t4Z9JGSy/ether-dracula.jpg)

Gruvbox
![Ether - Gruvbox theme](https://i.postimg.cc/Kj82y6k6/ether-gruvbox.jpg)

Nord
![Ether - Nord theme](https://i.postimg.cc/Pq1hbznR/ether-nord.jpg)

B&W
![Ether - B&W theme](https://i.postimg.cc/pTZH4WTQ/ether-b-w.jpg)

## Configuration Options

- colors
- links
- keybinds
- image
  - image position (if your image is cropped, this sets where the image crop happens)
- search engine (only google and ddg for now)

You can download your configuration as JSON if you want to store it somewhere.

![Ether settings - import json](https://i.postimg.cc/XYtzwZ8p/ether-settings.jpg)

To quickly get you up to speed, there's an option to import json vs configurating everything in the menu.
The import json option allows you to import your settings piece-by-piece ( ie. importing only links and theme ) or all at once.

## Setting it up as your new tab page

### The easy way

---

Download the new tab override extension for your browser, and in your extension settings point it at https://www.lookingcoolonavespa.com/Ether.

[Chrome extension](https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna)

[Firefox extension](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/)

### For a creamier, buttery experience

---

This is a bit more time-consuming but for those of you looking for an extra creamy, buttery, velvety experience, this is what you want to do.

1. **Getting the files**

Download the code via the "<> Code" and extract it somewhere
or if you're comfortable with the terminal, you can run `gh repo clone lookingcoolonavespa/Ether`.

Remember where you store it because we're going to come back to it later.

If you want to build it yourself, the build command is `npm run build`.

2. **Setting up nginx**

   1. Install Nginx: If you haven't already, you'll need to install Nginx on your machine. You can do this using your package manager or by downloading the latest version from the Nginx website.

   2. Serving your site: Next, you'll need to configure Nginx to serve your site files. Open the Nginx configuration file (usually located at /etc/nginx/nginx.conf if you're using linux) in a text editor, and add the following code inside the http block:

   ```
       server {
           listen 8000;
           root PATH_TO_THE_CODE/dist;
           index index.html;
       }
   ```

   This tells Nginx to listen on port 8000 and serve files from the "dist" folder of your code directory. The "dist" folder is where the build is located. The "index" directive tells Nginx to look for an index.html file by default when serving the site.

   3. Adding a cache: To give your server that coconut butter you want to add a cache. Add the following code:

   ```
        proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m inactive=2d;

        server {
            (code you copied from above)

            location / {
                # Enable caching for 10 days
                expires 10d;
                add_header Cache-Control public;

                # Use the cache zone defined earlier
                proxy_cache my_cache;
                proxy_cache_valid 200 2d;
                proxy_cache_bypass $http_pragma;
                proxy_cache_revalidate on;
                proxy_cache_min_uses 1;
                proxy_cache_methods GET HEAD;
                proxy_cache_key "$scheme$request_method$host$request_uri";
            }
        }
   ```

   4. Start Nginx: Once you've configured Nginx, you can start it by running the following command:

   `sudo systemctl start nginx`

   This will start the Nginx service in the background.

   Verify that your site is working: Open a web browser and navigate to http://localhost:8000. You should see your site's content (in this case, the "Hello, world!" message we added in step 3).

   That's it! You now have Nginx serving your site locally on your machine. You can stop the Nginx service by running sudo systemctl stop nginx, and you can restart it by running `sudo systemctl restart nginx`. If you need to make changes to your site files or Nginx configuration, you'll need to restart the Nginx service for the changes to take effect.

   (with help from ChatGPT)

3. **Setting up your browser**

   1. Create a file called local-settings.js.

   2. In this file, paste the following lines:

   ```
       // The file must begin with a comment
       pref("general.config.filename", "mozilla.cfg");
       pref("general.config.obscure_value", 0);
       pref("general.config.sandbox_enabled", false);

   ```

   3. Find your firefox directory and place local-settings.js in /YOUR_FIREFOX_DIR/default/pref/

   4. Create another file called mozilla.cfg and paste the following lines:

   ```

   // The file must begin with a comment
   var {classes:Cc, interfaces:Ci, utils:Cu} = Components;

   /_ set new tab page _/
   try {
       Cu.import("resource:///modules/AboutNewTab.jsm");
       var newTabURL = "http://localhost:8000";
       AboutNewTab.newTabURL = newTabURL;
   } catch(e){Cu.reportError(e);} // report errors in the Browser Console

    // Auto focus new tab content
    try {
        Cu.import("resource://gre/modules/Services.jsm");
        Cu.import("resource:///modules/BrowserWindowTracker.jsm");

        Services.obs.addObserver((event) => {
            window = BrowserWindowTracker.getTopWindow();
            window.gBrowser.selectedBrowser.focus();
            }, "browser-open-newtab-start");

    } catch(e) { Cu.reportError(e); }

   ```

   5. Place this file in your firefox directory.

There you go. Now you're set up for the creamy, smooth, velvety, super silky experience that you deserve.

## Resources/Inspiration

[Hero Patterns by Steve Schoger](www.heropatterns.com)

[Fludity start page by PrettyCoffee](https://github.com/PrettyCoffee/fluidity/tree/main/src)

[Startpage by voxie12](https://github.com/voxie12/voxie12.github.io)
