import { json, error } from '@sveltejs/kit';
import { database } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';

// GET: /api/comments?post_id=...
export async function GET(event) {
    const db = await database(event);
    const post_id = event.url.searchParams.get('post_id');
    if (!post_id) error(400, 'Missing post_id');
    // Get all comments for the post
    let comments = await db
        .select()
        .from(table.comments)
        .where(eq(table.comments.post_id, post_id));
    // Sort by (upvotes - downvotes) descending, defaulting nulls to 0
    comments = comments.sort(
        (a, b) =>
            ((b.upvotes ?? 0) - (b.downvotes ?? 0)) -
            ((a.upvotes ?? 0) - (a.downvotes ?? 0))
    );
    return json(comments);
}

// POST: Add or update comment for a post (one per user per post)
export async function POST(event) {
    if (!event.locals.user) error(401, 'Not logged in');
    const db = await database(event);
    const { post_id, content } = await event.request.json();
    if (!post_id || !content) error(400, 'Missing post_id or content');

    // Check if user already commented on this post
    const existing = await db
        .select()
        .from(table.comments)
        .where(and(
            eq(table.comments.post_id, post_id),
            eq(table.comments.user_id, event.locals.user.id)
        ));

    const now = new Date().toISOString();

    if (existing.length > 0) {
        // Update existing comment
        await db.update(table.comments)
            .set({ content, date_created: now })
            .where(eq(table.comments.id, existing[0].id));
        return json({ updated: true });
    } else {
        // Insert new comment
        await db.insert(table.comments).values({
            id: crypto.randomUUID(),
            post_id,
            user_id: event.locals.user.id,
            content,
            date_created: now,
            upvotes: 0,
            downvotes: 0
        });
        return json({ created: true });
    }
}

// PATCH: Edit comment (only by owner) OR upvote/downvote (only by logged-in user)
// PATCH: Upvote/downvote with per-user tracking
export async function PATCH(event) {
    if (!event.locals.user) error(401, 'Not logged in');
    const db = await database(event);
    const { id, vote } = await event.request.json();
    if (!id || !['up', 'down'].includes(vote)) error(400, 'Invalid vote');

    // Check for existing vote
    const existing = await db
        .select()
        .from(table.comment_votes)
        .where(and(
            eq(table.comment_votes.comment_id, id),
            eq(table.comment_votes.user_id, event.locals.user.id)
        ));

    if (existing.length === 0) {
        // New vote
        await db.insert(table.comment_votes).values({
            id: crypto.randomUUID(),
            comment_id: id,
            user_id: event.locals.user.id,
            vote
        });
    } else if (existing[0].vote !== vote) {
        // Change vote
        await db.update(table.comment_votes)
            .set({ vote })
            .where(eq(table.comment_votes.id, existing[0].id));
    } // else: already voted the same way, do nothing

    // Recalculate upvotes/downvotes
    const votes = await db
        .select()
        .from(table.comment_votes)
        .where(eq(table.comment_votes.comment_id, id));
    const upvotes = votes.filter(v => v.vote === 'up').length;
    const downvotes = votes.filter(v => v.vote === 'down').length;
    await db.update(table.comments)
        .set({ upvotes, downvotes })
        .where(eq(table.comments.id, id));

    return json({ upvotes, downvotes });
}

// DELETE: Remove comment (only by owner)
export async function DELETE(event) {
    if (!event.locals.user) error(401, 'Not logged in');
    const db = await database(event);
    const { id } = await event.request.json();
    if (!id) error(400, 'Missing id');

    // Only allow deleting own comment
    const deleted = await db.delete(table.comments)
        .where(and(
            eq(table.comments.id, id),
            eq(table.comments.user_id, event.locals.user.id)
        ));

    if (deleted.changes === 0) error(403, 'Not allowed');
    return json({ deleted: true });
}