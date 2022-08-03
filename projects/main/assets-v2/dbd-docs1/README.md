# About

Discord-Dashboard is a module that allows you to create a simple Dashboard for the Discord Bot using Node.js. The module has the entire API system integrated and only requires the user to configure the necessary options. He doesn't have to write the whole API from scratch. We also allow you to choose a Theme that you can change at any time when using the module without worrying about changing the system.

# Full Sample

Full code example can be found in this blog post: [https://assistants.ga/discord-dashboard-guide-part-2-basic-project-example/](https://assistants.ga/discord-dashboard-guide-part-2-basic-project-example/)

You can also generate one using <a href="#/?id=generate-sample-dashboard">this code</a>.

# Get help

Join our Discord Support Server

<a href="https://discord.gg/Nkc8MWxHRD"> <img src="https://discordapp.com/api/guilds/803034737261936670/widget.png" alt="Discord server"/></a>

# Demo

**Capriham Theme:** https://caprihamdbd.assistants.ga/

**Dark Dashboard Theme:** https://darkdbd.assistants.ga/

# Install

```sh
npm i discord-dashboard
```

or

```sh
yarn add discord-dashboard
```

## 1. Define Module

```js
let DBD = require('discord-dashboard');
```

## 2. Use License

To use the Dashboard, you must have a license generated for the project. You will generate one through your Assistants Center account on the [https://licenses.assistants.ga/](https://licenses.assistants.ga/) website. There is an OpenSource license available for FREE.


```js
await DBD.useLicense('licenseId');
```

## 3. Update Dashboard Class

If your license is correct, a new class has just been added to the Dashboard. Therefore, you must redefine the Dashboard to access it.

```js
DBD.Dashboard = DBD.UpdatedClass();
```

## 4. Create a Dashboard Class

Now, to create a working Dashboard - you should create a Dashboard class. This is extremely simple.

```js
const Dashboard = new DBD.Dashboard({DashboardConfig});
```

## 5. Init Dashboard

```js
Dashboard.init();
```

# Documentation

## Methods

### Generate Sample Dashboard

This method allows you to create a sample, fully functioning Dashboard for the Discord Bot with *discord-dashboard*.

```js
DBD.initDashboard({fileName, domain, port, token, clientSecret, clientId, licenseId});
```

| Argument    | Type   |                                                                                            |
|-------------|--------|--------------------------------------------------------------------------------------------|
| fileName    | String | It's the file Name to which example Dashboard is saved (pass it without the `.js` suffix). |
| domain      | String | Your project domain. If hosted on localhost, `http://localhost/`.                          |
| port        | Number | Port on which the Dashboard will be listening.                                             |
| token       | String | Your Bot Token.                                                                            |
| clientSecret | String | Your Client Secret.                                                                        |
| clientId    | String | Your Client ID.                                                                            |
| licenseId   | String | Your project license from Assistants Center: Licenses.                                     |

How to get clientSecret and clientId? Read our blog post: [https://assistants.ga/how-do-i-get-a-discord-bot-token-client-id-client-secret-and-redirect-uri/](https://assistants.ga/how-do-i-get-a-discord-bot-token-client-id-client-secret-and-redirect-uri/)


### Create Form Type

Fages Types is something you will need in the settings for the Dashboard class. This is the method that defines what type of data will be presented.















#### Select

```js
DBD.formTypes.select(list, disabled)
```

| Argument | Type      |                                                                                                |
|----------|-----------|------------------------------------------------------------------------------------------------|
| list     | Object    | Array presented as follows: `{ displayName: valueReturned, displayName2: valueReturned2 }` |
| disabled | Boolean   | Boolean check for if the select should be disabled or not.                                     |

##### Data required for `getActualSet` function

String, `valueReturned` value for option actual set.

##### Data returned

String, `valueReturned` value for option selected.








<hr>








#### Multiple Select

```js
DBD.formTypes.multiSelect(list, disabled, required),
```

| Argument | Type      |                                                                                             |
|----------|-----------|---------------------------------------------------------------------------------------------|
| list     | Object    | Array presented as follows: `{ displayName: valueReturned, displayName2: valueReturned2 }`  |
| disabled | Boolean   | Boolean check for if the select should be disabled or not.                                  |
| required | Boolean   | Boolean check for if the select should be required or not.                                  |

##### Data required for `getActualSet` function

Array, list of `valueReturned` to be selected.

**Important**: If any, return empty Array - no null or undefined.

##### Data returned

Array, list of selected `valueReturned` values | or an empty Array.







<hr>








#### Input

```js
DBD.formTypes.input(placeholder, min, max, disabled, required),
```

| Argument    | Type     |                                                           |
|-------------|----------|-----------------------------------------------------------|
| placeholder | String   | Input placeholder.                                        |
| min         | Number   | Minimum length.                                           |
| max         | Number   | Maximum length.                                           |
| disabled    | Boolean  | Boolean check for if the input should be disabled or not. |
| required    | Boolean  | Boolean check for if the input should be required or not. |

##### Data required for `getActualSet` function

String, value to be displayed.

##### Data returned

String, value set | or null.











<hr>








#### Textarea

```js
DBD.formTypes.textarea(placeholder, min, max, disabled, required),
```

| Argument    | Type     |                                                              |
|-------------|----------|--------------------------------------------------------------|
| placeholder | String   | Textarea placeholder.                                        |
| min         | Number   | Minimum length.                                              |
| max         | Number   | Maximum length.                                              |
| disabled    | Boolean  | Boolean check for if the textarea should be disabled or not. |
| required    | Boolean  | Boolean check for if the textarea should be required or not. |

##### Data required for `getActualSet` function

String, value to be displayed.

##### Data returned

String, value set | or null.











<hr>








#### Color Select

```js
DBD.formTypes.colorSelect(defaultState, disabled),
```

| Argument     | Type    |                                                                  |
|--------------|---------|------------------------------------------------------------------|
| defaultState | String  | Default state HEX color.                                         |
| disabled     | Boolean | Boolean check for if the color select should be disabled or not. |

##### Data required for `getActualSet` function

String, actual set HEX color.

##### Data returned

String, new HEX color.


#### Embed Builder

```js
DBD.formTypes.embedBuilder(defaultSettings),
```

| Argument        | Type   |                                                                                         |
|-----------------|--------|-----------------------------------------------------------------------------------------|
| defaultSettings | Object | { username: string, avatarURL: string, defaultJson: {EMBED_BUILDER_Interface} } |


##### Embed Builder Interface

```js
interface EmbedBuilder {
    content: string,
    embed: {
        title?: string,
        description?: string,
        color?: string | number,
        timestamp?: any,
        url?: string,
        author?: {
            name?: string,
            url?: string,
            icon_url?: string
        },
        thumbnail?: {
            url?: string
        },
        image?: {
            url?: string
        },
        footer?: {
            text?: string,
            icon_url?: string
        },
        fields?: [ EmbedBuilderField ],
    }
}

interface EmbedBuilderField {
    name?: string,
    value?: string,
    inline?: boolean
}
```


##### Simple Embed Builder Example

```js
{
  username: null,
  avatarURL: null,
  defaultJson: {
        content: "Did you know that if you don't know something, you don't know it? This riddle was solved by me. Don't thank me.",
        embed: {
            timestamp: new Date().toISOString(),
            url: "https://discord.com",
            description: "There was a boar, everyone liked a boar. One day the boar ate my dinner and escaped through the chimney. I haven't seen a boar since then.",
            author: {
                name: "Assistants Center",
                url: "https://assistants.ga",
                icon_url: "https://media.discordapp.net/attachments/911644960590270484/934513385402413076/ac_fixed.png"
            },
            image: {
                url: "https://unsplash.it/380/200"
            },
            footer: {
                text: "Crated with Discord-Dashboard",
                icon_url: "https://cdn.discordapp.com/emojis/870635912437047336.png"
            },
            fields: [
                {
                    name: "Hello",
                    value: "Hi, Assistants Center loves you <:ac_love:806492057996230676>"
                },
                {
                    name: "Do you know that",
                    value: "You can use custom emojis there, even from server where bot isn't :Kekwlaugh:",
                    inline: false
                },
            ]
        }
    }
}
```


#### Spacer

Usage is kinda different for this one. You don't need to define getActualSet, etc. Just define an option as:

```js
{
    optionType: 'spacer',
    title: string,
    description: string
}
```


| Argument    | Type     |                                                           |
|-------------|----------|-----------------------------------------------------------|
| title       | String   | Title string for spacer. You can use HTML there.          |
| description | String   | Description string for spacer. You can use HTML there.    |





















<hr>








#### Switch

```js
DBD.formTypes.switch(disabled),
```

| Argument    | Type     |                                                            |
|-------------|----------|------------------------------------------------------------|
| disabled    | Boolean  | Boolean check for if the switch should be disabled or not. |

##### Data required for `getActualSet` function

Boolean, to be turned on or not.

**Important:**

Please note that `if(saved.state)` will return false if data is not set. If you want to default state to be true, use this:

```js
getActualSet: ({guild,user}) => {
    return (SAVED_STATE == null || SAVED_STATE == undefined) ? DEFAULT_STATE : SAVED_STATE;
}
```

##### Data returned

Boolean, true if turned on - false if turned off.












<hr>








#### Checkbox

```js
DBD.formTypes.checkbox(disabled),
```

| Argument    | Type     |                                                              |
|-------------|----------|--------------------------------------------------------------|
| disabled    | Boolean  | Boolean check for if the checkbox should be disabled or not. |

##### Data required for `getActualSet` function

Boolean, to be checked or not.

**Important:**

Please note that `if(saved.state)` will return false if data is not set. If you want to default state to be true, use this:

```js
getActualSet: ({guild,user}) => {
    return (SAVED_STATE == null || SAVED_STATE == undefined) ? DEFAULT_STATE : SAVED_STATE;
}
```

##### Data returned

Boolean, true if ckecked - false if unchecked.


















<hr>








#### Channels Select

```js
DBD.formTypes.channelsSelect(disabled, channelTypes = ['GUILD_TEXT']),
```

| Argument     | Type    |                                                                          |
|--------------|---------|--------------------------------------------------------------------------|
| disabled     | Boolean | Boolean check for if the channels select should be disabled or not.      |
| channelTypes | Array   | An Array (!) of types of channels to be included in the channels select. |

##### Data required for `getActualSet` function

String, channel ID.

##### Data returned

String, channel ID | or null.











<hr>








#### Channels Multi Select

```js
DBD.formTypes.channelsMultiSelect(disabled, required, channelTypes = ['GUILD_TEXT']),
```

| Argument     | Type    |                                                                                   |
|--------------|---------|-----------------------------------------------------------------------------------|
| disabled     | Boolean | Boolean check for if the multiple channels select should be disabled or not.      |
| required     | Boolean | Boolean check for if the multiple channels select should be required or not.      |
| channelTypes | Array   | An Array (!) of types of channels to be included in the multiple channels select. |

##### Data required for `getActualSet` function

Array of Strings (Channels IDs) | or an empty Array.

##### Data returned

Array of Strings (Channels IDs) | or an empty Array.
















<hr>








#### Roles Select

```js
DBD.formTypes.rolesSelect(disabled),
```

| Argument     | Type    |                                                                  |
|--------------|---------|------------------------------------------------------------------|
| disabled     | Boolean | Boolean check for if the roles select should be disabled or not. |

##### Data required for `getActualSet` function

String, role ID.

##### Data returned

String, role ID | or null.











<hr>








#### Roles Multi Select

```js
DBD.formTypes.rolesMultiSelect(disabled, required),
```

| Argument     | Type    |                                                                           |
|--------------|---------|---------------------------------------------------------------------------|
| disabled     | Boolean | Boolean check for if the multiple roles select should be disabled or not. |
| required     | Boolean | Boolean check for if the multiple roles select should be required or not. |

##### Data required for `getActualSet` function

Array of Strings (Roles IDs) | or an empty Array.

##### Data returned

Array of Strings (Roles IDs) | or an empty Array.
















### Create Custom Page Type

There are 3 types of Custom Pages: redirect to another page, custom HTML and JSON Api.

-`endpoint` is stuff after url to your project. For example, endpoint: `/test/stuff` will be accessible from the `localhost/test/stuff` URL. Localhost can be also your domain or IP adress.

-`getDataFunction` function is function to get data to return. For redirect, it will be an URL string. For custom HTML, it will be HTML string. For JSON Api, it will be an JSON Object.

#### Redirect to URL

```js
DBD.customPagesTypes.redirectToUrl(endpoint: String, getDataFunction: Function<String>),
```


#### Render HTMl

```js
DBD.customPagesTypes.renderHtml(endpoint: String, getDataFunction: Function<String>),
```

#### Send JSON

```js
DBD.customPagesTypes.sendJson(endpoint: String, getDataFunction: Function<Object>),
```

#### Usage Example

```js
    customPages: [
        DBD.customPagesTypes.redirectToUrl('/redirect-to-foo', ({user}) => {
            if(user.id)return `https://foo.com/?user=${user.id}`;
            return "https://foo.com/?user=false";
        }),
        DBD.customPagesTypes.renderHtml('/html-render', ({user}) => {
            return `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Test</title>
                </head>
                <body>
                    <h1>${user.id ? `Hello, ${user.username}!` : `You are not logged in.`}</h1>
                </body>
            </html>
            `
        }),
        DBD.customPagesTypes.sendJson('/json-test', ({user}) => {
            return {
                error: user.id ? false : true,
                message: user.id ? null : "User not logged in.",
                user: user
            };
        })
    ]
```

## Dashboard Class

?> **Dashboard class** works correctly only if you have previously used the async function for `DBD.useLicense('licenseId')` and you updated the **Dashboard class** with `DBD.UpdatedClasses()`. [Check Install step to how to do this properly.](https://assistants.ga/dbd-docs/#/?id=install)


### Config

#### Port (required)

```js
...
    port: 80, 
...
```

| Option | Type   |                                              |
|--------|--------|----------------------------------------------|
| port   | Number | The port on which the Dashboard will listen. |

#### Client (required)

```js
...
    client: {
        id: '',
        secret: ''
    },
...
```

| Option | Type   |                            |
|--------|--------|----------------------------|
| id     | String | Discord Bot Client ID.     |
| secret | String | Discord Bot Client Secret. |

[How to get them?](https://assistants.ga/how-do-i-get-a-discord-bot-token-client-id-client-secret-and-redirect-uri/)

#### Redirect URI (required)

```js
...
    redirectUri: '',
...
```

| Option      | Type   |                                                                                                      |
|-------------|--------|------------------------------------------------------------------------------------------------------|
| redirectUri | String | Discord.js Bot OAuth2 defined Redirect Uri. For discord-dashboard it's `domain.com/discord/callback` |

[How can I set OAuth2 redirect URI?](https://assistants.ga/how-do-i-get-a-discord-bot-token-client-id-client-secret-and-redirect-uri/)

#### Domain (required)

```js
...
    domain: 'domain.com', 
...
```

| Option | Type   |                                                                                                                                                                                                                                                               |
|--------|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| domain | String | Your domain with protocol (`http://domain.com` or `https://domain.com`) or localhost with http protocol (`http://localhost`). If you're using port different than `80` for `http` and `443` for `https`, then you need to add `:port` after domain/localhost. |

#### Discord.js Bot Client (required)

```js
...
    bot: <DiscordJSClient>,
...
```

| Option | Type  |                                                                             |
|--------|-------|-----------------------------------------------------------------------------|
| bot    | Class | Discord.js Client Class. Need to be logged in with the token before define. |

#### Theme Module (required)

```js
...
    theme: <ThemeModule>,
...
```

| Option | Type                 |                                 |
|--------|----------------------|---------------------------------|
| theme  | Object (ThemeModule) | Discord-Dashboard theme module. |

Discord-Dashboard themes are listed in the <a href="#/?id=themes">Themes</a> section.

#### Settings (required)

Please go to the <a href="#/?id=dashboard-config-settings">Dashboard Config Settings</a> section.

#### Required Permissions

You can restrict the availability of the Dashboard to only users with reassurance data on the server. This is done with this option.

It must be an Array of `DISCORD_FLAGS.Permissions` that you want to require users to have in order to allow them to use the Dashboard.

`DISCORD_FLAGS.Permissions` is accesible from:

```js
DBD.DISCORD_FLAGS.Permissions.PERMISSION_NAME
```

Discord-Dashboard allows to use multiple permissions required:

```js
requiredPermissions: [DBD.DISCORD_FLAGS.Permissions.MANAGE_GUILD, DBD.DISCORD_FLAGS.Permissions.BAN_MEMBERS, ...]
```

`PERMISSION_NAME`s available:

```js
CREATE_INSTANT_INVITE
KICK_MEMBERS
BAN_MEMBERS
ADMINISTRATOR
MANAGE_CHANNELS
MANAGE_GUILD
ADD_REACTIONS
VIEW_AUDIT_LOG
PRIORITY_SPEAKER
STREAM
VIEW_CHANNEL
SEND_MESSAGES
SEND_TTS_MESSAGES
MANAGE_MESSAGES
EMBED_LINKS
ATTACH_FILES
READ_MESSAGE_HISTORY
MENTION_EVERYONE
USE_EXTERNAL_EMOJIS
VIEW_GUILD_INSIGHTS
CONNECT
SPEAK
MUTE_MEMBERS
DEAFEN_MEMBERS
MOVE_MEMBERS
USE_VAD
CHANGE_NICKNAME
MANAGE_NICKNAMES
MANAGE_ROLES
MANAGE_WEBHOOKS
MANAGE_EMOJIS_AND_STICKERS
USE_APPLICATION_COMMANDS
REQUEST_TO_SPEAK
MANAGE_EVENTS
MANAGE_THREADS
CREATE_PUBLIC_THREADS
CREATE_PRIVATE_THREADS
USE_EXTERNAL_STICKERS
SEND_MESSAGES_IN_THREADS
START_EMBEDDED_ACTIVITIES
MODERATE_MEMBERS
```

Each permission is described on [Discord OAuth2 Documentation](https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags).

**Default value**: 

```js
requiredPermissions: [ DBD.DISCORD_FLAGS.Permissions.MANAGE_GUILD ],
```



#### Accept Privacy Policy

Automatically accept the privacy policy for the Dashboard without having to give consent in the console.

```js
...
    acceptPrivacyPolicy: Boolean=false,
...
```

#### Don't Create Server

Do not create and don't listen an express http/-s server for Dashboard.

```js
...
    noCreateServer: Boolean=false,
...
```

#### SSL

If you want to use the https protocol, you must provide us with a certificate and an SSL key String. This can also be `fs.readFileSync`.

```js
...
    SSL: {
        enabled: Boolean=false,
        key: String='',
        cert: String=''
    },
...
```

#### Minimalized Console Logs

If you want to restrict console logs through Assistants Center, you can do so using this option.

```js
...
    minimizedConsoleLogs: Boolean=false,
...
```

#### Invite Endpoint

Specify `/invite` endpoint behavior.

```js
...
    invite: {
        clientId: String=this.bot.user.id,
        scopes: Array=["bot"],
        permissions: String='0',
        redirectUri: String='',
        otherParams: String=''
    },
...
```

#### Support Server

Create an endpoint containing a link with an invitation to your Discord Support server.

```js
...
    supportServer: {
        slash: String='/support-server',
        inviteUrl: String=''
    },
...
```

#### Join Guild After Authorization

Automatically add a user to your Discord Server where the bot is when they log into the Dashboard - yes, it's possible!

```js
...
    guildAfterAuthorization: {
        use: Boolean=false,
        guildId: String
    },
...
```

### Methods

#### Init Dashboard

A function used at the end of all work. It creates a server application and listens to the server (unless config option says otherwise).

It should be used after all other Dashboard methods because changes made to the Dashboard App will no longer be visible after listening to it, e.g. a module used after - not before - this function - will not work as it should.

```js
Dashboard.init();
```

#### Use 3rd Party Module

The Dashboard allows you to include a module created by the Community. This is possible through a simple method:

```js
Dashboard.useThirdPartyModule(<Module>);
```

**Important:** You need to use it before the `Dashboard.init()` method!

### DBD Events

The Dashboard class allows you to listen for events in the Dashboard. For example, you can know when and what user has logged into the Dashboard and what settings they have changed in Bots.

```js
Dashboard.DBDEvents.on(EVENT_TYPE, (data) => {
    //
});
```

#### User Logged In

```js
Dashboard.DBDEvents.on('userLoggedIn', (data)=>{
    //
});
```

- **Data returned**: `<DiscordOAuthUserResponse>` Object.

#### Website Viewed

```js
Dashboard.DBDEvents.on('websiteView', (data)=>{
    //
});
```

- **Data returned**: `<UserSessionObject>` if user is logged in or `{loggedIn: false}` if not.

#### Guild Settings Updated

```js
Dashboard.DBDEvents.on('guildSettingsUpdated', (data)=>{
    //
});
```

- **Data returned**: `{user: <UserSessionObject>, changes: {<successedChanges>, <erroredChanges>}}`

## 3rd Party Module Example

```js
module.exports = {
    app: ({app,config,themeConfig}) => {
        app.get('/moduleexample', (req,res)=>{
           res.send('ModuleExample: Hello World!');
        });
    },
    server: ({io,server,config,themeConfig}) => {
        const test = io.of('/moduleexample');
        test.on('connection', () => {
            console.log('ModuleExample socket.io connected.');
        });
    }
}
```

## Themes

The best thing about our Dashboard - Themes!

Themes currently available and created by the Dashboard Community will always be listed here, so check back occasionally - every new Theme is better than the last!

```js
...
    theme: <ThemeModule>,
...
```

### Capriham Theme

**Resources:**

- [NPM](https://www.npmjs.com/package/dbd-capriham-theme), [GitHub](https://github.com/breftejk/dbd-capriham-theme)

![](https://cdn.assistants.ga/kqwivftx)


### Dark Dashboard

**Resources:**

- [NPM](https://www.npmjs.com/package/dbd-dark-dashboard), [GitHub](https://github.com/PlainDevelopment/dbd-dark-dashboard)

![](https://camo.githubusercontent.com/a5768145e7ca3f74d4673fb99937251734f1ed4b9a85f15e1a3057826cc86cd6/68747470733a2f2f692e696d6775722e636f6d2f3333736b3947692e706e67)

## Web Sockets

Dashboard has the Socket.io system loaded into it.

### Access

```js
const SocketIO = Dashboard.io;
```

**Important:** Socket.io is only available after using the `Dashboard.init()` method.

### Usage

```js
    const test = SocketIO.of('/test');
    test.on('connection', () => {
        console.log('ModuleExample socket.io connected.');
    });
```

Web Socket is now accesible from the `ws://domain.com/test` if the SSL is not used with the Dashboard or `wss://domain.com/test` if it is.

## Dashboard Config Settings

Dashboard settings are simply a complex list of options that the user will be able to change in it. Our module allows the user to divide settings into categories, so this list should contain a category object. The category object itself also contains a list of settings for the category.

```js
...
    settings: [
        categoryObject,
        categoryObject,
    ],
...
```

### Category Object

```js
{
    categoryId: '',
    categoryName: "",
    categoryDescription: "",
    categoryOptionsList: [
        categoryOptionObject,
        categoryOptionObject,
    ]
}
```

| Option              | Type   |                                                 |
|---------------------|--------|-------------------------------------------------|
| categoryId          | String | Category ID (must be lowercase and unique).     |
| categoryName        | String | Category name. Can include HTML code.           |
| categoryDescription | String | Category description. Can include HTML code.    |
| categoryOptionsList | Array  | An Array of the `categoryOptionObject` Objects. |


### Category Option Object

```js
{
    /*Required options*/
    optionId: '',
    optionName: "",
    optionDescription: "",
    optionType: <DBDFormType>,
    getActualSet: async ({guild,user}) => {
        return <DBDFormTypeValueType>;
    },
    setNew: async ({guild,user,newData}) => {
        return <DBDFormTypeValueType>;
    },
    /*Optional options*/
    allowedCheck: async ({guild,user}) => {
        if(guild.id == "123456789876")return {allowed: false, errorMessage: 'You cannot use this option - guild is blacklisted for it.'};
        if(user.id == "123456789876")return {allowed: false, errorMessage: 'You cannot use this option - user is blacklisted for.'};
        return {allowed: true, errorMessage: null};
    }
}
```

- **Options:**

| Option                  | Type                   |                                                                                                                                                             |
|-------------------------|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| optionId                | String                 | Option ID (must be lowercase and unique).                                                                                                                   |
| optionName              | String                 | Option name. Can include HTML code.                                                                                                                         |
| optionDescription       | String                 | Option description. Can include HTML code.                                                                                                                  |
| optionType              | Object (DBD Form Type) | DBD Option Type. Options Types listed in the <a href="#">Form Types</a> section.                                                                            |
| getActualSet            | async Function         | The function for which you should return the currently set value for the option. The function passes you a `user` and a `guild` Objects.                    |
| setNew                  | async Function         | A function that the Dashboard performs whenever a `user` user changes the settings of an option. It passes you the `user`, `guild`, and `newData` Objects.  |
| allowedCheck (optional) | async Function         | A function that checks if option should be enabled to be changed by user on guild. It passes you the `user` and `guild` Objects.                            |
- **Objects**:


| Object  | Type                                  |                                                                                          |
|---------|---------------------------------------|------------------------------------------------------------------------------------------|
| guild   | Object: `{id: DiscordGuildID}`        | GUILD ID where the settings were updated (String).                                       |
| user    | Object: `{id: DiscordUserID}`         | User ID who has updated settings on GUILD (String).                                      |
| newData | Depends on the type of the Form Type. | This is something that `user` has set as a wanted value for a new option on the `guild`. |

### Errors Handling

#### Server-Side

The Dashboard provides a limit on the availability of options for a given recipient, or set of recipients. This can be a restriction to a list of users, or to a requirement to have a role on a given server.

If the user tries to change the settings despite not having permission, the server will return an error.

```js
...
    allowedCheck: async ({guild,user}) => {
        return {allowed: Bollean, errorMessage: String | null};
    },
...
```

#### setNew Function-Side

If you want to return an error when setting a new option value, return the Object containing the error option and set its value as the text that should be displayed. The user will be notified of the error when setting the new value (e.g., is too long, no permissions).

```js
...
    setNew: async ({guild,user,newData}) => {
        return {error: "Error text."};
    }
...
```

If you don't want to send any error, return nothing or return an empty Object.

```js
...
    setNew: async ({guild,user,newData}) => {
        return; //or return {};
    }
...
```