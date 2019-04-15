---
title: A Guide to Desktop PWAs | Part 1
desc: A guide to building a Progressive Web App.
keywords:
  - guide
  - pwa guide
  - web development
  - pwa
  - progressive web app
---

# A Guide to Desktop PWAs | Part 1

## What is a Progressive Web App?
A Progessive Web App (PWA for short) is a web application acting as a web application.  
When the app launches, it displays contents of a specified URL.  
They also work offline.  

## Properties of PWAs

+ Responsive<br>
  They should scale up and down according to the viewport and should feel like a native app.
+ Fast<br>
  The app should load fast that the user is not distracted from the app.
+ App-like interface<br>
  As they are apps, they should feel like apps.

## Why a PWA?
- Creating a PWA is easy as desiging a webpage.
- No app store
- Automatic updates

## How to build a PWA
To build a PWA, you need a web manifest.  
Now we will use <a rel="noopener noreferrer" href="https://www.pwabuilder.com/">pwabuilder.com</a> to build our PWA.  
<!-- You should have Google Chrome installed, because it will help us build our PWA.  
Open Google Chrome.  -->
Open <a rel="noopener noreferrer" href="https://www.pwabuilder.com/">pwabuilder.com</a> and enter your website URL and wait.  
Then click `Choose Service Worker`.  
Then select `Offline copy with Backup offline page`.  
Replace `const offlineFallbackPage = "ToDo-replace-this-name.html";` in the section at the bottom right with `const offlineFallbackPage = "offline.html";`.  
Then create a fallback page named `offline.html`.  
Then follow the instructions on the page until you click `Done`.  
Then open your site and open the console.  
If you seen messages starting with `[PWA Builder]` in the console the service worker is created.  
Now you have finished setting up one of the most critical things to create a PWA.  

## Create a manifest
Without a web manifest, the browser won't know how to display the app.  
Use the following example template for the web manifest.  
```
{
"dir" : "ltr",
    "lang" : "en",
    "name" : "{app name}",
    "scope" : "/",
    "display" : "standalone",
    "start_url" : "{url to be display when the app is launched}",
    "short_name" : "{short name}",
    "theme_color" : "{hex adress bar/splash screen color}",
    "description" : "{description}",
    "orientation" : "any",
    "background_color" : "{hex background color}",
    "prefer_related_applications" : false,
    "icons" : [
    {
      "src" : "{icon url}",
      "sizes" : "{icon size {number}x{number}}"
    },
    ]}
```
Fill the places in curly braces with values.  
Then save it in your web server.  
Then add the following tag to your html head section.   

```
<link href="{manifest url}" rel="manifest">
```

Replace `{manifest url}` with the manifest URL.  
Now add you need to listen on the `beforeinstallprompt` event.  
Here is a JavaScript example.  


```
var deferredPrompt = {prompt:(()=>{})}
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // TODO: Insert code to update UI to inform the user that they can install the app here.
}
window.installPWA = function(){
  // TODO: Trigger window.installPWA() when user selects to install the app.
  // TODO: Insert code to remove the install app button.
  deferredPrompt.prompt()
}
```

You built your first PWA!  
For more info, go to the [Google Developers](https://developers.google.com/web/fundamentals/app-install-banners/) website.  
