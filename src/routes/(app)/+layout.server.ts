import { fail, redirect, type Actions, type RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { database } from '$lib/server/db';
import * as auth from '$lib/server/auth';

export const load: PageServerLoad = async (event: RequestEvent) => {
  return { user: event.locals.user };
};