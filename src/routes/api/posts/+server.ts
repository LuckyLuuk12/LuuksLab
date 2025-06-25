import { json, error } from '@sveltejs/kit';
import { database } from '$lib/server/db';
import { and, eq } from 'drizzle-orm';
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

export async function PATCH(event) {
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

    // If admin, allow full edit
    if (event.locals.user?.role === 'admin') {
        try {
            // Exclude 'likes' from admin updates
            const { likes, ...fields } = data.fields ?? {};
            await db.update(table.posts)
                .set({ ...fields, last_modified: new Date().toISOString() })
                .where(eq(table.posts.id, data.id))
                .run();
            return json({ success: true });
        } catch (e) {
            throw error(500, 'Failed to update post');
        }
    }

    // If not admin, only allow liking once per user
    if (data.like === true && event.locals.user) {
        // Check if user already liked this post
        const existing = await db
            .select()
            .from(table.post_likes)
            .where(
                and(
                    eq(table.post_likes.post_id, data.id),
                    eq(table.post_likes.user_id, event.locals.user.id)
                )
            );
        if (existing.length > 0) {
            return json({ success: false, message: 'Already liked' });
        }
        // Insert like record and increment likes
        await db.insert(table.post_likes).values({
            id: crypto.randomUUID(),
            post_id: data.id,
            user_id: event.locals.user.id
        }).run();
        await db.update(table.posts)
            .set({ likes: (table.posts.likes as any) + 1 })
            .where(eq(table.posts.id, data.id))
            .run();
        return json({ success: true });
    }

    // Otherwise, forbidden
    throw error(403, 'Not allowed');
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
        await db.delete(table.posts).where(eq(table.posts.id, id)).run();
        return json({ success: true });
    } catch (e) {
        throw error(500, 'Failed to delete post');
    }
}