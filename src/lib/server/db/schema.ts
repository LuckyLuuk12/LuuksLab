import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
/**
 * Ensures types compatability with this schema:
 * ```sql
 * CREATE TABLE user (
 *  id TEXT PRIMARY KEY,
 *  username TEXT UNIQUE,
 *  email TEXT UNIQUE,
 *  password_hash TEXT, -- nullable if using only social login
 *  role TEXT NOT NULL DEFAULT 'user',
 *  google_id TEXT UNIQUE -- for Google login
 * );
 * ```
 */
export const user = sqliteTable('user', {
    id: text('id').primaryKey(),
    username: text('username').unique(),
    email: text('email').unique(),
    passwordHash: text('password_hash'), // nullable if using only social login
    role: text('role').notNull().default('user'),
    googleId: text('google_id').unique() // for Google login
});

/**
 * Ensures types compatability with this schema:
 * ```sql
 * CREATE TABLE session (
 *  id TEXT PRIMARY KEY,
 *  user_id TEXT NOT NULL REFERENCES user(id),
 *  expires_at INTEGER NOT NULL
 * );
 * ```
 */
export const session = sqliteTable("session", {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

/**
 * Ensures types compatability with this schema:
 * ```sql
 * CREATE TABLE posts (
 *  id TEXT PRIMARY KEY,
 *  title TEXT NOT NULL,
 *  subtitle TEXT,
 *  author_id TEXT NOT NULL REFERENCES user(id),
 *  content_html TEXT NOT NULL,
 *  date_published TEXT,
 *  last_modified TEXT,
 *  likes INTEGER DEFAULT 0,
 *  slug TEXT UNIQUE,
 *  view_state TEXT DEFAULT 'public', -- 'public', 'private'
 *  cover_image_url TEXT,
 *  summary TEXT,
 *  tags TEXT,
 *  view_count INTEGER DEFAULT 0
 * );
 * ```
 */
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

/**
 * Ensures types compatability with this schema:
 * ```sql
 * CREATE TABLE comments (
 *  id TEXT PRIMARY KEY,
 *  post_id TEXT NOT NULL REFERENCES posts(id),
 *  user_id TEXT NOT NULL REFERENCES user(id),
 *  content TEXT NOT NULL,
 *  date_created TEXT DEFAULT CURRENT_TIMESTAMP,
 *  upvotes INTEGER DEFAULT 0,
 *  downvotes INTEGER DEFAULT 0
 * );
 * ```
 */
export const comments = sqliteTable('comments', {
    id: text('id').primaryKey(),
    post_id: text('post_id').notNull().references(() => posts.id),
    user_id: text('user_id').notNull().references(() => user.id),
    content: text('content').notNull(),
    date_created: text('date_created').default(new Date().toISOString()),
    upvotes: integer('upvotes').default(0),
    downvotes: integer('downvotes').default(0)
});

/**
 * Ensures types compatability with this schema:
 * ```sql
 * CREATE TABLE comment_votes (
 *  id TEXT PRIMARY KEY,
 *  comment_id TEXT NOT NULL REFERENCES comments(id),
 *  user_id TEXT NOT NULL REFERENCES user(id),
 *  vote TEXT NOT NULL CHECK (vote IN ('up', 'down')) -- 'up' or 'down'
 * ); 
 * ```
 */
export const comment_votes = sqliteTable('comment_votes', {
    id: text('id').primaryKey(),
    comment_id: text('comment_id').notNull().references(() => comments.id),
    user_id: text('user_id').notNull().references(() => user.id),
    vote: text('vote').notNull(), // 'up' or 'down'
});
/**
 * Ensures types compatability with this schema:
 * ```sql
 * CREATE TABLE post_likes (
 * id TEXT PRIMARY KEY,
 * post_id TEXT NOT NULL REFERENCES posts(id),
 * user_id TEXT NOT NULL REFERENCES user(id)
 * );
 * ```
 */
export const post_likes = sqliteTable('post_likes', {
    id: text('id').primaryKey(),
    post_id: text('post_id').notNull().references(() => posts.id),
    user_id: text('user_id').notNull().references(() => user.id),
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type CommentVote = typeof comment_votes.$inferSelect;
export type PostLike = typeof post_likes.$inferSelect;
