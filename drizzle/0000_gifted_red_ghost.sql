CREATE TABLE `articles` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`description` text,
	`link` text NOT NULL,
	`published_at` integer DEFAULT (current_timestamp) NOT NULL,
	`is_sent` integer DEFAULT false NOT NULL,
	`source_id` text,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE cascade ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `senders` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`to` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sendersToSources` (
	`sender_id` text NOT NULL,
	`source_id` text NOT NULL,
	FOREIGN KEY (`sender_id`) REFERENCES `senders`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`source_id`) REFERENCES `sources`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sources` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`link` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_link_unique` ON `articles` (`link`);--> statement-breakpoint
CREATE UNIQUE INDEX `senders_name_unique` ON `senders` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `senders_to_unique` ON `senders` (`to`);--> statement-breakpoint
CREATE UNIQUE INDEX `sources_name_unique` ON `sources` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `sources_link_unique` ON `sources` (`link`);