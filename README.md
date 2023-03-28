# Ether - an aesthetic, functional startpage

I was tired of having to press so many buttons to get to where I wanted to go so I built this start page.
Navigate to your favorite sites with just a keypress or start a search with the Shift key.

## Pre-configured themes

Swap out the colors or the image if they're not to your liking. Here are some pre-configured themes to get you started.

Everforest dark

Everforest light

Catppuccin

Dracula

Gruvbox

Nord

B&W

## Configuration Options

- colors
- links
- keybinds
- image
  - image position (if your image is cropped, this sets where the image crop happens)

You can download your configuration as JSON if you want to store it somewhere.

To quickly get you up to speed, there's an option to import json vs configurating everything in the menu.
The import json option allows you to import your settings piece-by-piece ( ie. importing only links and theme ) or all at once.

## Setting it up as your new tab page

### The easy way

Download the new tab override extension for your browser, and in your extension settings point it at https://www.lookingcoolonavespa.com/Ether.

### For a creamy, buttery experience

This is a bit more time-consuming but for those of you looking for creamy, buttery, velvety experience, this is what you want to do.

#### Setting up nginx

(courtesy of ChatGPT)

1. Install Nginx: If you haven't already, you'll need to install Nginx on your machine. You can do this using your package manager or by downloading the latest version from the Nginx website.

2. Create a directory for your site files: You'll need to create a directory to hold the files for your site. For example, you could create a directory called "my-site" in your home directory:

3. Configure Nginx: Next, you'll need to configure Nginx to serve your site files. Open the Nginx configuration file (usually located at /etc/nginx/nginx.conf) in a text editor, and add the following code inside the http block:

per

server {
listen 8000;
root /home/your-username/my-site;
index index.html;
}

This tells Nginx to listen on port 8000 and serve files from the "my-site" directory in your home directory. The "index" directive tells Nginx to look for an index.html file by default when serving the site.

4. Start Nginx: Once you've configured Nginx, you can start it by running the following command:

   sudo systemctl start nginx

   This will start the Nginx service in the background.

   Verify that your site is working: Open a web browser and navigate to http://localhost:8000. You should see your site's content (in this case, the "Hello, world!" message we added in step 3).

That's it! You now have Nginx serving your site locally on your machine. You can stop the Nginx service by running sudo systemctl stop nginx, and you can restart it by running sudo systemctl restart nginx. If you need to make changes to your site files or Nginx configuration, you'll need to restart the Nginx service for the changes to take effect.

#### Setting up your browser

1. Create file called local-settings.js.

2. In this file, paste the following lines:

3. Find your firefox directory and place local-settings.js in /default/pref/

4. Create another file called mozilla.cfg and paste the following lines:

5. Place this file in your firefox directory.

There you go. Now you're set up for the creamy, smooth, velvety, super silky experience that you deserve.
