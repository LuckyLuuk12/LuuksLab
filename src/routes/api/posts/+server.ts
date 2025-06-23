import { json, error } from '@sveltejs/kit';
import { database } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';

// Optional: Admin check helper
function requireAdmin(locals: App.Locals) {
    if (!locals.user || locals.user.role !== 'admin') {
        error(403, 'Admin access required');
    }
}

export async function GET(event) {
    const db = await database(event);
    const posts = await db.select().from(table.posts);
    return json(posts);
}

export async function POST(event) {
    requireAdmin(event.locals);
    const db = await database(event);
    const data = await event.request.json();
    const now = new Date().toISOString();
    await db.insert(table.posts).values({
        ...data,
        date_published: now,
        last_modified: now,
    });
    return json({ success: true });
}

export async function PATCH(event) {
    requireAdmin(event.locals);
    const db = await database(event);
    const data = await event.request.json();
    await db.update(table.posts)
        .set({ ...data.fields, last_modified: new Date().toISOString() })
        .where(eq(table.posts.id, data.id));
    return json({ success: true });
}

export async function DELETE(event) {
    requireAdmin(event.locals);
    const db = await database(event);
    const { id } = await event.request.json();
    await db.delete(table.posts).where(eq(table.posts.id, id));
    return json({ success: true });
}