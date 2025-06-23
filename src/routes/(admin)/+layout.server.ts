import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    if (!locals.user) {
        redirect(302, '/login'); // or another page
    }
    if (locals.user.role !== 'admin') {
        error(403, '/'); // or another page for unauthorized access
    }
    return { user: locals.user }
};