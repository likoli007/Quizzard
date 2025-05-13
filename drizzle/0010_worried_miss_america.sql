DROP INDEX "authenticator_credentialID_unique";--> statement-breakpoint
ALTER TABLE `quiz_answers` ALTER COLUMN "answer" TO "answer" integer;--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);