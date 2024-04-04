export interface Env {
	CANVAS_TOKEN: string

	LAST_ANNOUNCEMENTS: KVNamespace
}

interface Announcement {
	id: number
	title: string
	message: string
	url: string
	author: {
		display_name: string
		avatar_image_url: string | null
	}
}

type CanvasResponse = Announcement[]

interface Course {
	courseID: string
	canvasID: number
	announcementWebhook: string
}

import courses from '../courses.json'

const checkCourse = async ({ courseID, canvasID, announcementWebhook }: Course, env: Env) => {
	const announcements = await (await fetch(`https://canvas.ucsc.edu/api/v1/courses/${canvasID}/discussion_topics?only_announcements=true&no_avatar_fallback=1`, {
		headers: {
			authorization: `Bearer ${env.CANVAS_TOKEN}`
		}
	})).json() as CanvasResponse

	const lastAnnouncementID = +(await env.LAST_ANNOUNCEMENTS.get(courseID) ?? 0)

	const newAnnouncements = announcements.filter(announcement => announcement.id > lastAnnouncementID)
	if (!newAnnouncements.length) return new Response('')

	await env.LAST_ANNOUNCEMENTS.put(courseID, Math.max(...announcements.map(announcement => announcement.id)).toString())

	newAnnouncements.reverse()

	for (const announcement of newAnnouncements) {
		const content = (await (await fetch('https://turndown.advaith.io', {
			method: 'POST',
			body: announcement.message
		})).text()).replace(/\[(.+?)\]\((mailto:)?\1\)/g, '$1').replace(/\[(https?:\/\/.+?)\]\(.+?\)/g, '$1').replace(/https?:\/\/[^\s"'<>]+/g, url => url.replaceAll('\\', ''))

		await fetch(announcementWebhook, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				username: `${announcement.author.display_name} on Canvas`,
				avatar_url: announcement.author.avatar_image_url,
				content: `## ${announcement.title}\n\n${content}`,
				components: [
					{
						type: 1,
						components: [
							{
								type: 2,
								label: 'View on Canvas',
								style: 5,
								url: announcement.url
							}
						]
					}
				],
				allowed_mentions: {
					parse: []
				}
			})
		})
	}
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return new Response('ok')
	},
	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
		for (const course of courses) {
			await checkCourse(course, env)
		}
	}
}
