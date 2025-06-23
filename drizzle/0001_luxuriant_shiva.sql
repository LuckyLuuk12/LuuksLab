CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`author_id` text NOT NULL,
	`content_html` text NOT NULL,
	`date_published` text,
	`last_modified` text,
	`likes` integer DEFAULT 0,
	`slug` text,
	`view_state` text DEFAULT 'public',
	`cover_image_url` text,
	`summary` text,
	`tags` text,
	`view_count` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);