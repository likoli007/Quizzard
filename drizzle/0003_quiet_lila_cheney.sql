PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_topics` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`content` text NOT NULL,
	`category` text NOT NULL,
	`user_id` text,
	`published_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_topics`("id", "title", "description", "content", "category", "user_id", "published_at", "created_at", "updated_at") SELECT "id", "title", "description", "content", "category", "user_id", "published_at", "created_at", "updated_at" FROM `topics`;--> statement-breakpoint
DROP TABLE `topics`;--> statement-breakpoint
ALTER TABLE `__new_topics` RENAME TO `topics`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `quizzes` ALTER COLUMN "user_id" TO "user_id" text;