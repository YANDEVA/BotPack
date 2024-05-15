# BotPack🤖<sub><sub>v1.7.6🚀</sub></sub>
<p align="center">
	<a href="https://nodejs.org/dist/v16.20.0">
		<img src="https://img.shields.io/badge/Nodejs%20Support-18.x-brightgreen.svg?style=flat-square" alt="Nodejs Support v18.x">
	</a>
  <img alt="Size" src="https://img.shields.io/github/repo-size/YANDEVA/BotPack.svg?style=flat-square&label=size">
  <img alt="Version" src="https://img.shields.io/badge/dynamic/json?color=brightgreen&label=code%20version&prefix=v&query=%24.version&url=https://github.com/YANDEVA/BotPack/raw/main/package.json&style=flat-square">
  <img alt="Visitors" src="https://visitor-badge.laobi.icu/badge?style=flat-square&page_id=YANDEVA.BotPack">
</p>
A Simple BotPack for starting a Messenger chatbot.

<img align="center" src="https://i.ibb.co/gMMvsYf/20240125-225244-0000.png"></a>

### ABOUT

Hello there! Thank you for using BotPack! Join us at [ChatBot Community Ltd.](https://www.facebook.com/groups/178711334798450/?ref=share)🍪 if you wish to share and discover Mirai/BotPack commands created by other command creators!

> [!NOTE]
> - If you encounter any issues or difficulties, don't hesitate to reach out and ask for assistance here. Our team is here to help you with any problems you may face.

---

### BOT DETECTION
__=>__ Have you ever experienced this type of issue in facebook?
  
<img align="center" src="https://i.ibb.co/4SChsvH/facebook.jpg">

Maybe, I can help you with that. So these are the things to do. Go to your **config.json** and look for **autoCreateDB**. If you found it, then simply replace true to false.
<br><br>
__BEFORE:__
```json
{
  "autoCreateDB": true,
}
```
__AFTER:__
```json
{
 "autoCreateDB": false,
}
```
<br>
By setting this to false, some commands like checktt, rankup and other commands that needs database may not work but it has a good benefit making your bot last longer and might avoid being suspended for a long period of time.

---

<details>
  <summary>What's New?</summary>
  
  __UPDATE!__
  - Fixed Render Issue.
  - Added unfont.js
  - Added sharecontact.js
  - Bug fixed!
  - HandleReply.js issue fixed!
</details>

<details>
  <summary>Languages</summary>
  
> - en = English-US 
> - vi = Vietnamese 
> - tl = Tagalog 
> - cb = Bisaya/Cebuano
> - bd = Bengali 
> - ar = Arabic

Go to your config.json and set it in the language property:
```json
{
  "language": "en",
}
```

Looking for a French language translation done by a local French! Your contribution would be greatly appreciated, and credits will be provided!
</details>

<details>
  <summary>Appstate Encryption</summary>
  
  ### Security 
  Are you having an issue about getting your account stolen or hacked? This might due to your appstate provided which is stolen by other users. If you feel unsecure, try setting up *"encryptSt"* to *true* in the **config.json**.
  
  ```json
  {
    "encrpytSt": true
  }
  ```

  Encrypting won't affect the bot process and will only make the appstate harder to be used by thiefs and hackers. Furthermore, it may get laggy when opening the appstate.json after being encrypted but still it is worth a shot.
  
</details>

---
### RENDER HOSTING
__=>__ Host your botfile on [render.com](https://dashboard.render.com) to make your file always active.
- If you have some issues related to render hosting! Try our newly created facebook group with render hosting discussions!
- Im currently looking for companions and conversation starters who have some knowledge about hosting in render to become moderators.
- Feel free to join us at [Render Community](https://www.facebook.com/groups/7389392131128817/?ref=share) on Facebook! See you there!
[<img align="center" src="https://i.ibb.co/DMXyLm3/Picsart-24-02-14-12-25-06-014.jpg">](https://www.facebook.com/groups/7389392131128817/?ref=share&mibextid=NSMWBT)
</h1>

<details>
  <summary>Tutorials</summary>

 > __How to Host BotPack on render.com?__
 ><br> Watch the tutorial [here!](https://www.facebook.com/share/v/JXGAppBJ6A9TNzjb/?mibextid=oFDknk)
 > [<img align="center" src="https://i.ibb.co/wKkZ6Lc/render.jpg">](https://www.facebook.com/share/v/JXGAppBJ6A9TNzjb/?mibextid=oFDknk)
  
</details>

---

- Welcome to the [BotPack](https://replit.com/@YanMaglinte/BotPack)🌀 repository. This project is an unofficial bot file from the [Mirai](https://github.com/m1raibot/miraiv2) Repository, initially developed and maintained by [Phạm Văn Diện](https://github.com/D-Jukie/Disme-Bot.git), better known as [D-Jukie](https://github.com/D-Jukie). The base file for this project is sourced from the [Disme-Bot](https://github.com/D-Jukie/Disme-Bot.git) GitHub project.

- [BotPack](https://replit.com/@YanMaglinte/BotPack)🌀 is a modified messenger bot file by [Yan Maglinte](https://replit.com/@YanMaglinte)🇵🇭. It is a refined version of the Mirai messenger bot, with some unique enhancements. 

- A key feature is the `usePrefix` function integrated within every command. This function removes the need for prefixes, providing a more streamlined user experience. Alongside ready-made commands and free-to-edit codes, this bot file encourages users to learn and explore freely.
<img align="center" src="https://i.imgur.com/Je8NbDn.jpg"/>

- Further, [BotPack](https://replit.com/@YanMaglinte/BotPack)🌀 comes with a user-friendly feature that allows easy customization of your console design via the `theme` option in the config.json file. This makes it highly accessible, especially for beginners.
<img align="center" src="https://i.imgur.com/wHD2zXv.jpg"/>

<details>
  <summary>Available Themes</summary>
  
> - Blue
> - Aqua
> - Fiery
> - Orange
> - Pink
> - Red
> - Retro
> - Sunlight
> - Teen
> - Summer
> - Flower
> - Ghost
> - Purple
> - Rainbow
> - Hacker

Go to your `config.json` and set it in the language property:
```json
{
  "DESIGN": {
    "Title": "BotPack",
    "Theme": "Blue",
    "Admin": "YOUR_NAME"
  }
}
```
</details>

- Embrace the world of possibilities with [BotPack](https://replit.com/@YanMaglinte/BotPack)🌀 - a facebook Messenger file designed to make your interaction with messenger bots smoother and more efficient.
---
<div align="center">
      <h3>My Replit Account:
      <a href="https://replit.com/@YanMaglinte" style="color: green;"><br>@YanMaglinte🔥</a>
        <br>
        My Facebook Account:<a href="https://www.facebook.com/yandeva.me?mibextid=b06tZ0" style="color: green;"><br>Yan🚀</a></h3></div>

- If you encounter any issues or have questions related to this REPL, please don't hesitate to reach out to me on Facebook. I'm here to assist you!

<img align="center" src="https://i.ibb.co/pnm38zY/yanmaglinte.png"/>

### **HOW TO START USING BOTPACK?**

1. Begin by navigating to [Replit](https://replit.com).
2. Log in to your existing account or sign up for a new one.
3. Utilize the search bar to find [BotPack](https://replit.com/@YanMaglinte/BotPack).
4. Click on `templates`.
5. Upon searching, select the most popular BotPack template from the results.
6. Afterwards, click `Use Template`.
7. After forking the template, setup your PREFIX, BOTNAME and other properties in your `config.json`.
8. Open your `Facebook Account` that you want to turn into a chatbot.
9. After logging in, get your appstate using [C3C fbstate](https://github.com/c3cbot/c3c-fbstate/archive/refs/tags/1.5.zip) extension.
10. Copy the appstate, return to the repository, and paste it into your appstate.json.
11. Now, run it, and there you have your bot!

> [!WARNING]
> *There is a risk of your account being banned after running the code, so please ensure proper account management and handling. If it happens, please try logging in again and retrieve your app state.*

### CREDITS
Special thanks to the following fellows for their amazing projects making this modified project possible:
- SpermLord
- CatalizCS
- D-Jukie
- NTKhang03
- KhangGia1810
- XaviaTeam
<br><br> __In collaboration with__
  - [Liane Cagara 🎀](https://www.facebook.com/nealiana.kaye.cagara?mibextid=ZbWKwL)

_Updated on: May 12, 2024 (PST)<br>Creation Date: June 11, 2023_

---
Copyright © 2024 Yan Maglinte (YANDEVA), Philippines.<br>
