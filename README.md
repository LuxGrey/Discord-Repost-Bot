# Discord-Repost-Bot

This is a Node.js app that serves as the backend for a Discord bot that helps with sharing media from other websites.

As of now this bot is only able to share reddit posts in Discord server channels.
Further features and changes to how this bot is used may follow.

## Requirements

* Node.js
* npm or equivalent
* host must have an open HTTP port to receive share commands

## Usage

Create a `.env` file in the app's root directory, based on `.env.sample`, and make the following adjustments:

* `BOT_TOKEN` = the bot token of the registered Discord Application that you want to be controlled by this app
* `CHANNEL_ID` = the ID of the Discord server channel that the bot should post to

The Discord bot that will be controlled by the app of course needs to have access to the configured server channel as well as have permissions for sending messages and embedding links.

Start the app with `npm start`.
Once it is running, you can prompt the bot to send Discord messages by sending requests to the REST-API.

**I plan to develop a web browser plugin that adds buttons to reddit posts which send the relevant requests to the REST-API when clicked.**

### REST-API

#### Share a reddit post

`POST /share/reddit`

JSON-Body:
```json
{"postUrl":"<postUrl>"}
```
where `<postUrl>` may be the URL of a subreddit post (i.e. `www.reddit.com/r/<subreddit>/comments/<postId>/<postTitle>/`)
or a user profile post (i.e. `www.reddit.com/user/<user>/comments/<postId>/<postTitle>/`)

## Security

The app does not support HTTPS requests, so all requests that prompt the bot to send messages on Discord must be performed
over basic unencrypted HTTP.

There are no authorization checks in place to limit who can prompt the bot; if not otherwise prevented, anyone with knowledge of the IP address of the hosting server can prompt it to send Discord messages to the configured channel.