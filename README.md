# canvas-poster

canvas-poster crossposts all posts and announcements from Canvas into Discord, with a button to view the original post in Canvas.

Based on [ed-poster](https://github.com/advaith1/ed-poster).

## Prerequisites

canvas-poster runs on Cloudflare Workers for free.

You will need:
* A [Cloudflare account](https://dash.cloudflare.com/sign-up)
* [Node.js](https://nodejs.org/en) installed locally
* A Discord server
* A [Discord bot](https://discord.com/developers/applications) token with Manage Webhook permissions in the server

## Setup

First, clone this repository and run `pnpm i`. (If pnpm isn't installed, run `corepack enable` first.) Copy wrangler.example.toml to wrangler.toml and courses.example.json to courses.json.

Create an [Canvas access token](https://canvas.ucsc.edu/profile/settings). Run `pnpm set-token` and type in the API token when prompted. You may be prompted to log in to your Cloudflare account first.

Run `pnpm create-kv`, then copy the provided binding ID into wrangler.toml.

In courses.json, set the `courseID`	to a unique string for the course, and set `canvasID` to the numeric course ID in the Canvas URL.

With the Discord bot token, [create a webhook](https://discord.com/developers/docs/resources/webhook#create-webhook) in the announcements channel using the API. POST to https://discord.com/api/v10/channels/CHANNELID/webhooks with `{ "name": "Canvas" }`, with the [authorization header](https://discord.com/developers/docs/reference#authentication). You cannot create the webhook in the Discord app, you must use a bot. Take the `url` field in the response and set it as `announcementWebhook` in courses.json.

When you're done, run `pnpm run deploy`. canvas-poster will now check every minute for new Canvas announcements and send them to the appropriate Discord channel.
