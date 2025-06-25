import { json, error } from '@sveltejs/kit';
import { database } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';

// Optional: Admin check helper
function requireAdmin(locals: App.Locals) {
    if (!locals.user || locals.user.role !== 'admin') {
        throw error(403, 'Admin access required');
    }
}

export async function GET(event) {
    let db;
    try {
        db = await database(event);
    } catch (e) {
        throw error(500, 'Failed to connect to database');
    }
    try {
        const posts = await db.select().from(table.posts);
        return json(posts);
    } catch (e) {
        throw error(500, 'Failed to fetch posts');
    }
}

export async function POST(event) {
    try {
        requireAdmin(event.locals);
    } catch (e) {
        throw error(403, 'Admin access required');
    }
    let db;
    try {
        db = await database(event);
    } catch (e) {
        throw error(500, 'Failed to connect to database');
    }
    let data;
    try {
        data = await event.request.json();
    } catch (e) {
        throw error(400, 'Invalid JSON in request body');
    }
    const now = new Date().toISOString();
    try {
        await db.insert(table.posts).values({
            ...data,
            date_published: now,
            last_modified: now,
        });
        return json({ success: true });
    } catch (e) {
        throw error(500, 'Failed to create post');
    }
}

export async function PATCH(event) {
    try {
        requireAdmin(event.locals);
    } catch (e) {
        throw error(403, 'Admin access required');
    }
    let db;
    try {
        db = await database(event);
    } catch (e) {
        throw error(500, 'Failed to connect to database');
    }
    let data;
    try {
        data = await event.request.json();
    } catch (e) {
        throw error(400, 'Invalid JSON in request body');
    }
    try {
        await db.update(table.posts)
            .set({ ...data.fields, last_modified: new Date().toISOString() })
            .where(eq(table.posts.id, data.id));
        return json({ success: true });
    } catch (e) {
        throw error(500, 'Failed to update post');
    }
}

export async function DELETE(event) {
    try {
        requireAdmin(event.locals);
    } catch (e) {
        throw error(403, 'Admin access required');
    }
    let db;
    try {
        db = await database(event);
    } catch (e) {
        throw error(500, 'Failed to connect to database');
    }
    let id;
    try {
        const body = await event.request.json();
        id = body.id;
        if (!id) throw new Error();
    } catch (e) {
        throw error(400, 'Invalid or missing post id');
    }
    try {
        await db.delete(table.posts).where(eq(table.posts.id, id));
        return json({ success: true });
    } catch (e) {
        throw error(500, 'Failed to delete post');
    }
}