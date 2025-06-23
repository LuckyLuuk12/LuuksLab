// import { boolean } from 'drizzle-orm/gel-core';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
    id: text('id').primaryKey(),
    username: text('username').unique(),
    email: text('email').unique(),
    passwordHash: text('password_hash'), // nullable if using only social login
    role: text('role').notNull().default('user'),
    googleId: text('google_id').unique() // for Google login
});

export const session = sqliteTable("session", {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const posts = sqliteTable('posts', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    subtitle: text('subtitle'),
    author_id: text('author_id').notNull(),
    content_html: text('content_html').notNull(),
    date_published: text('date_published'),
    last_modified: text('last_modified'),
    likes: integer('likes').default(0),
    slug: text('slug').unique(),
    view_state: text('view_state').default('public'), // 'public', 'private'
    cover_image_url: text('cover_image_url'),
    summary: text('summary'),
    tags: text('tags'),
    view_count: integer('view_count').default(0),
});

export const comments = sqliteTable('comments', {
    id: text('id').primaryKey(),
    post_id: text('post_id').notNull().references(() => posts.id),
    user_id: text('user_id').notNull().references(() => user.id),
    content: text('content').notNull(),
    date_created: text('date_created').default(new Date().toISOString()),
    upvotes: integer('upvotes').default(0),
    downvotes: integer('downvotes').default(0)
});

export const comment_votes = sqliteTable('comment_votes', {
    id: text('id').primaryKey(),
    comment_id: text('comment_id').notNull().references(() => comments.id),
    user_id: text('user_id').notNull().references(() => user.id),
    vote: text('vote').notNull(), // 'up' or 'down'
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type Post = typeof posts.$inferSelect;

export type Comment = typeof comments.$inferSelect;

export type CommentVote = typeof comment_votes.$inferSelect;