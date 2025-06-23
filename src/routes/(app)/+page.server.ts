import * as auth from '$lib/server/auth';
import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { database } from '$lib/server/db';


export const actions: Actions = {
	logout: async (event: RequestEvent<Partial<Record<string, string>>, string | null>) => {
		if (!event.locals.session) {
			return fail(401);
		}
		const db = database(event);
		await auth.invalidateSession(await db, event.locals.session.id);
		auth.deleteSessionTokenCookie(event);

		return redirect(302, '/login');
	},
};
