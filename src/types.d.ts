declare module '@mixmark-io/domino' {
  export function createDocument(html: string): Document
}

interface Env {
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
