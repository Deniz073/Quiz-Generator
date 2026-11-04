ALTER TABLE "quiz" ADD COLUMN "published_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "quiz" ADD COLUMN "imported_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "quiz" ADD COLUMN "imported_from_id" text;--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_owner_id_imported_from_id_unique" UNIQUE("owner_id","imported_from_id");--> statement-breakpoint
CREATE INDEX "quiz_imported_from_id_idx" ON "quiz" ("imported_from_id");--> statement-breakpoint
CREATE INDEX "quiz_published_at_idx" ON "quiz" ("published_at") WHERE "published_at" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_imported_from_id_quiz_id_fkey" FOREIGN KEY ("imported_from_id") REFERENCES "quiz"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_published_is_personal" CHECK ("published_at" IS NULL OR "owner_id" IS NOT NULL);--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_imported_is_personal" CHECK ("imported_at" IS NULL OR "owner_id" IS NOT NULL);--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_imported_from_is_imported" CHECK ("imported_from_id" IS NULL OR "imported_at" IS NOT NULL);