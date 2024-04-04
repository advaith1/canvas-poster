# canvas-poster

canvas-poster crossposts all posts and announcements from Canvas into Discord, with a button to view the original post in Canvas.

Based on [ed-poster](https://github.com/advaith1/ed-poster).

## Prerequisites

canvas-poster runs on Cloudflare Workers for free.

You will need:
* A [Cloudflare account](https://dash.cloudflare.com/sign-up)
* [Node.js](https://nodejs.org/en) installed locally
* A Discord server, where you have Manage Webhook permissions

## Setup

First, clone this repository and run `pnpm i`. (If pnpm isn't installed, run `corepack enable` first.) Copy wrangler.example.toml to wrangler.toml and courses.example.json to courses.json.

Create an [Canvas access token](https://canvas.ucsc.edu/profile/settings). Run `pnpm set-token` and type in the API token when prompted. You may be prompted to log in to your Cloudflare account first.

Run `pnpm create-kv`, then copy the provided binding ID into wrangler.toml.

In courses.json, set the `courseID`	to a unique string for the course, and set `canvasID` to the numeric course ID in the Canvas URL.

Use [Webhook Creator](https://webhook-creator.advaith.workers.dev) to create a webhook in the channel and get the URL. (Don't create the webhook in Discord settings, use this tool instead.) Copy the URL it gives you and set it as `announcementWebhook` in courses.json.

When you're done, run `pnpm run deploy`. canvas-poster will now check every minute for new Canvas announcements and send them to the appropriate Discord channel.
