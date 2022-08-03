# About

DBD Dark Dashboard is a theme to addon to the [Discord Dashboard](https://www.npmjs.com/package/discord-dashboard) module and brings a simple dashboard to life.

# Full Sample

Full dashboard example can be found in this blog post: [https://assistants.ga/discord-dashboard-guide-part-2-basic-project-example/](https://assistants.ga/discord-dashboard-guide-part-2-basic-project-example/)

# Get help

Join our Discord Support Server

<a href="https://discord.gg/Nkc8MWxHRD"> <img src="https://discordapp.com/api/guilds/803034737261936670/widget.png" alt="Discord server"/></a>

# Demo

**Dark Dashboard Theme:** https://darkdbd.assistants.ga/

# Install

```sh
npm i discord-dashboard
```

## 1. Define Module

```js
const DarkDashboard = require('dbd-dark-dashboard');
```

## 2. Define themeConfig
That is all you will need to get the theme up and running!
Must be defined inside of DashboardConfig which you can find [here](https://assistants.ga/dbd-docs/#/)!
```js
theme: DarkDashboard({ThemeConfig})
```

# Documentation
## ThemeConfig
   
### Full ThemeConfig
Here is the complete theme config. More details below.

```js
theme: DarkDashboard({
        information: {
            createdBy: "iMidnight",
            websiteTitle: "iMidnight",
            websiteName: "iMidnight",
            websiteUrl: "https:/www.imidnight.ml/",
            dashboardUrl: "http://localhost:3000/",
            supporteMail: "support@imidnight.ml",
            supportServer: "https://discord.gg/yYq4UgRRzz",
            imageFavicon: "https://www.imidnight.ml/assets/img/logo-circular.png",
            iconURL: "https://www.imidnight.ml/assets/img/logo-circular.png",
            loggedIn: "Successfully signed in.",
            mainColor: "#2CA8FF",
            subColor: "#ebdbdb",
        },
    
        sidebar: {
            keepDefault: true,
            list: [{
                icon: `<svg style="position: absolute; margin-left: 8px; margin-top: 2px;" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#2CA8FF"> <path d="M0 0h24v24H0z" fill="none"/> <path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44z"/> <path d="M10.59 15.41a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z"/></svg>`,
                title: "Title",
                link: "/commands",
                id: "commands",
            }]
        },
    
        index: {
            card: {
                category: "iMidnight's Panel - The center of everything",
                title: `Welcome to the iMidnight discord where you can control the core features to the bot.`,
                image: "https://i.imgur.com/axnP93g.png",
                footer: "Footer",
            },
            
            information: {
                category: "Category",
                title: "Information",
                description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
                footer: "Footer",
            },
            
            feeds: {
                category: "Category",
                title: "Information",
                description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
                footer: "Footer",
            },
        },

        commands: [
            {
                category: `Starting Up`,
                subTitle: `All helpful commands`,
                list: [{
                    commandName: 'bug',
                    commandUsage: `;bug <bug>`,
                    commandDescription: `test`,
                    commandAlias: 'No aliases'
                },
                {
                    commandName: "2nd command",
                    commandUsage: "oto.nd <arg> <arg2> [op]",
                    commandDescription: "Lorem ipsum dolor sth, arg sth arg2 stuff",
                    commandAlias: "Alias",
                },
                {
                    commandName: "Test command",
                    commandUsage: "prefix.test <arg> [op]",
                    commandDescription: "Lorem ipsum dolor sth",
                    commandAlias: "Alias",
                },
                ],
            },
        ],
})
```

#### General theme information

```js
...
information: {
    createdBy: "iMidnight",
    websiteTitle: "iMidnight",
    websiteName: "iMidnight",
    websiteUrl: "https:/www.imidnight.ml/",
    dashboardUrl: "http://localhost:3000/",
    supporteMail: "support@imidnight.ml",
    supportServer: "https://discord.gg/yYq4UgRRzz",
    imageFavicon: "https://www.imidnight.ml/assets/img/logo-circular.png",
    iconURL: "https://www.imidnight.ml/assets/img/logo-circular.png",
    pageBackGround: "linear-gradient(#2CA8FF, #155b8d)",
    loggedIn: "Successfully signed in.",
    mainColor: "#2CA8FF",
    subColor: "#ebdbdb",
}
...
```

| Argument         | Type   | Information                                             |
|------------------|--------|---------------------------------------------------------|
| `createdBy`      | String | Text to set name of Author in footer.                   |
| `websiteTitle`   | String | Name of website displayed in tab                        |
| `websiteName`    | String | Name of website for title displayed                     |
| `websiteUrl`     | String | Main Website/Dashboard URL for any buttons              |
| `dashboardUrl`   | String | Dashboard URL for buttons                               |
| `supporteMail`   | String | Support email for Privacy Policy or other buttons       |
| `supportServer`  | String | Support discord server                                  |
| `imageFavicon`   | String | Image for tab which is called favicon                   |
| `iconURL`        | String | Expects image URL for sidebar                           |
| `pageBackGround` | String | Set banner color/gradient using css                     |
| `loggedIn`       | String | Popup success text when logged in                       |
| `mainColor`      | String | Main dashboard Theme color using css                    |
| `subColor`       | String | Secondary dashboard Theme color using css               |


<hr>


#### Index page config


```js
...
index: {
    card: {
        category: "iMidnight's Panel - The center of everything",
        title: `Welcome to the iMidnight discord where you can control the core features to the bot.`,
        image: "https://i.imgur.com/axnP93g.png",
        footer: "Footer",
    },
    
    information: {
        category: "Category",
        title: "Information",
        description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
        footer: "Footer",
    },
    
    feeds: {
        category: "Category",
        title: "Information",
        description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
        footer: "Footer",
    },
}
...
```

| Argument         | Type    | Information                                        |
|------------------|---------|----------------------------------------------------|
| `card:`          | Object  | Main card on top                                   |
| `information:`   | Object  | Card displayed on left                             |
| `feeds:`         | Object  | Card displayed on right                            |
| `category`       | String  | Category of card - Displayed above title           |
| `title`          | String  | Title of card                                      |
| `description`    | String  | Description inside of card                         |
| `footer`         | String  | Footer text at the bottom of the card              |
| `imageFavicon`   | String  | Image for tab which is called favicon              |
| `image`          | String  | Expects image URL for main image - Only for `card` |



<hr>

#### Commands

```js
...
commands: [
        {
            category: "Starting Up",
            subTitle: "All helpful commands",
            aliasesDisabled: false,
            list: [{
                commandName: "bug",
                commandUsage: ";bug <bug>",
                commandDescription: "Report a bug to the developers of Wooar.",
                commandAlias: "No aliases"
                },
                
                {
                    commandName: "2nd command",
                    commandUsage: "oto.nd <arg> <arg2> [op]",
                    commandDescription: "Lorem ipsum dolor sth, arg sth arg2 stuff",
                    commandAlias: "Alias",
                },
                
                {
                    commandName: "Test command",
                    commandUsage: "prefix.test <arg> [op]",
                    commandDescription: "Lorem ipsum dolor sth",
                    commandAlias: "Alias",
                },
            ],
        }
]
...
```

| Argument             | Type    | Information                                        |
|----------------------|---------|----------------------------------------------------|
| `commands`           | Array   | Array of command categories                        |
| `category`           | String  | Name of category                                   |
| `subTitle`           | String  | Subtitle of category                               |
| `aliasesDisabled`    | Boolean | True if aliases should be disabled in the category |
| `list`               | Array   | Array for each command                             |
| `commandName`        | String  | Name of command                                    |
| `commandUsage`       | String  | Usage of command e.g `/help`                       |
| `commandDescription` | String  | Description for command use                        |
| `commandAlias`       | String  | Extra aliases for command                          |



<hr>

### Optional

These are the optional settings to further customize your dashboard!

#### Guild Server List

```js
...
guilds: {
    cardTitle: "Guilds",
    cardDescription: "Here are all the guilds you currenly have permissions for:",
    type: "blurlist"
},
...
```

| Argument             | Type   | Information                                                                          |
|----------------------|--------|--------------------------------------------------------------------------------------|
| `guilds`             | Object | Object for guild server list options                                                 |
| `cardTitle`          | String | Title text at the top of server list                                                 |
| `cardDescription`    | String | Description for the guild server list                                                |
| `type`               | String | Expects `blurlist` or `tablelist`. This allows you to pick between two types of list |


<hr>

#### Guild Settings Page

```js
...
guildInfo: {
    cardTitle: "Server Information",
    cardDescription: "An overview about your server",
},
guildSettings: {
    cardTitle: "Guilds",
    cardDescription: "Here you can manage all the settings for your guild:",
    customFooterCard: {
        subtitle: "tes",
        title: "test",
        customHTML: "html",
        footer: "footer",
    }
},
...
```

| Argument           | Type    | Information                                                               |
|--------------------|---------|---------------------------------------------------------------------------|
| `guildInfo`        | Object  | Object for the guild information card at the top                          |
| `cardTitle`        | String  | Title of card for guild information                                       |
| `cardDescription`  | String  | SubTitle of card for guild information                                    |
| `guildSettings`    | Object  | Object for guild settings options                                         |
| `cardTitle`        | String  | Title of the Guild settings card - **Optional**                           |
| `cardDescription`  | String  | Subtitle of the Guild settings card - **Optional**                        |
| `customFooterCard` | Object  | Add an extra card at the bottom of the guild settings page - **Optional** |
| `subtitle`         | String  | Subtitle of extra card                                                    |
| `title`            | String  | Title of extra card                                                       |
| `customHTML`       | String  | Custom HTML body                                                          |
| `footer`           | String  | Footer of extra card                                                      |

#### Custom popup sweetalert text!

```js
...
popupMsg: {
    savedSettings: "Saved settings", 
    noPerms: "Error",
},
...
```

| Argument        | Type   | Information                              |
|-----------------|--------|------------------------------------------|
| `popupMsg`      | Object | Object for popup options                 |
| `savedSettings` | String | Set custom text for saved settings popup |
| `noPerms`       | String | Set custom text for saved no perms popup |


#### Custom sidebar customization!

```js
...
sidebar: {
    keepDefault: true,
        list: [{
            icon: `<svg style="position: absolute; margin-left: 8px; margin-top: 2px;" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#2CA8FF">    <path d="M0 0h24v24H0z" fill="none"/> <path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0  0 0 1.74-1 10 10 0 0 0-.27-10.44z"/> <path d="M10.59 15.41a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z"/></svg>`,
            title: "Title",
            link: "/commands",
            id: "commands",
        }]
}
...
```

| Argument      | Type    | Information                                                                                                                                                                                        |
|---------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `sidebar`     | Object  | Object for sidebar options                                                                                                                                                                         |
| `keepDefault` | Boolean | Set to true to remove all default items from the sidebar                                                                                                                                           |
| `list`        | Array   | List for all of the extra sidebar items                                                                                                                                                            |
| `icon`        | Object  | Use any image using HTML - Use style `style="position: absolute; margin-left: 8px; margin-top: 2px;"` *Will add class soonTM*                                                                      |
| `title`       | String  | Title for new item                                                                                                                                                                                 |
| `link`        | String  | Href link for button                                                                                                                                                                               |
| `id`          | String  | Highlights the current page when id is equal to:<br/><br/>Home Page: `index` <br/>Manage Guilds Page & Specific Guild Page: `manage` <br/>Commands Page: `commands` <br/>Privacy Policy Page: `pp` |

## Reminder

?> **Dashboard class** works correctly only if you have previously used the async function for `DBD.useLicense('licenseId')` and you updated the **Dashboard class** with `DBD.UpdatedClasses()`. [Check Install step to how to do this properly.](https://assistants.ga/dbd-docs/#/?id=install)

### Dark Dashboard

**Resources:**

- [NPM](https://www.npmjs.com/package/dbd-dark-dashboard), [GitHub](https://github.com/Assistants-Center/dbd-dark-dashboard)

![](https://camo.githubusercontent.com/a5768145e7ca3f74d4673fb99937251734f1ed4b9a85f15e1a3057826cc86cd6/68747470733a2f2f692e696d6775722e636f6d2f3333736b3947692e706e67)