CREATE TABLE "quiz_note" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"quiz_id" text NOT NULL,
	"title" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quiz_note_title_length" CHECK (char_length("title") BETWEEN 1 AND 120),
	CONSTRAINT "quiz_note_body_length" CHECK (char_length("body") <= 100000)
);
--> statement-breakpoint
CREATE INDEX "quiz_note_user_quiz_idx" ON "quiz_note" ("user_id","quiz_id","updated_at");--> statement-breakpoint
CREATE INDEX "quiz_note_quiz_id_idx" ON "quiz_note" ("quiz_id");--> statement-breakpoint
ALTER TABLE "quiz_note" ADD CONSTRAINT "quiz_note_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "quiz_note" ADD CONSTRAINT "quiz_note_quiz_id_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE;