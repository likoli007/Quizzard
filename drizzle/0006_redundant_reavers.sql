ALTER TABLE `favorites` ADD `deleted` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `topics` ADD `deleted` integer DEFAULT 0 NOT NULL;