CREATE TYPE "attempt_kind" AS ENUM('chapter', 'exam');--> statement-breakpoint
CREATE TABLE "exam_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"quiz_id" text NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"question_count" integer NOT NULL,
	"current_position" integer DEFAULT 0 NOT NULL,
	"reviewing" boolean DEFAULT false NOT NULL,
	"pass_percent" integer NOT NULL,
	CONSTRAINT "exam_session_user_id_quiz_id_unique" UNIQUE("user_id","quiz_id"),
	CONSTRAINT "exam_session_deadline" CHECK ("ends_at" > "started_at"),
	CONSTRAINT "exam_session_ranges" CHECK ("question_count" >= 1 AND "current_position" >= 0 AND "current_position" < "question_count" AND "pass_percent" BETWEEN 1 AND 100)
);
--> statement-breakpoint
CREATE TABLE "exam_session_pick" (
	"session_id" uuid,
	"position" integer,
	"option_id" uuid,
	CONSTRAINT "exam_session_pick_pkey" PRIMARY KEY("session_id","position","option_id")
);
--> statement-breakpoint
CREATE TABLE "exam_session_question" (
	"session_id" uuid,
	"position" integer,
	"question_id" uuid NOT NULL,
	"option_order" integer[] NOT NULL,
	"flagged" boolean DEFAULT false NOT NULL,
	CONSTRAINT "exam_session_question_pkey" PRIMARY KEY("session_id","position"),
	CONSTRAINT "exam_session_question_session_id_question_id_unique" UNIQUE("session_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "question_flag" (
	"user_id" text,
	"question_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "question_flag_pkey" PRIMARY KEY("user_id","question_id")
);
--> statement-breakpoint
CREATE TABLE "quiz_attempt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"quiz_id" text NOT NULL,
	"chapter_id" uuid,
	"kind" "attempt_kind" NOT NULL,
	"score" integer NOT NULL,
	"total" integer NOT NULL,
	"finished_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quiz_attempt_chapter_matches_kind" CHECK (("kind" = 'chapter') = ("chapter_id" IS NOT NULL)),
	CONSTRAINT "quiz_attempt_score_range" CHECK ("total" >= 1 AND "score" >= 0 AND "score" <= "total")
);
--> statement-breakpoint
CREATE TABLE "user_quiz_exam_settings" (
	"user_id" text,
	"quiz_id" text,
	"question_count" integer,
	"minutes" integer,
	"pass_percent" integer,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_quiz_exam_settings_pkey" PRIMARY KEY("user_id","quiz_id"),
	CONSTRAINT "user_quiz_exam_settings_ranges" CHECK ("question_count" >= 1 AND "minutes" BETWEEN 1 AND 600 AND "pass_percent" BETWEEN 1 AND 100)
);
--> statement-breakpoint
CREATE TABLE "chapter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"quiz_id" text NOT NULL,
	"slug" text NOT NULL,
	"number" integer NOT NULL,
	"title" text NOT NULL,
	CONSTRAINT "chapter_quiz_id_slug_unique" UNIQUE("quiz_id","slug"),
	CONSTRAINT "chapter_quiz_id_number_unique" UNIQUE("quiz_id","number"),
	CONSTRAINT "chapter_id_quiz_id_unique" UNIQUE("id","quiz_id"),
	CONSTRAINT "chapter_slug_slug" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
--> statement-breakpoint
CREATE TABLE "question" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"quiz_id" text NOT NULL,
	"chapter_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"position" integer NOT NULL,
	"text" text NOT NULL,
	"explanation" text NOT NULL,
	CONSTRAINT "question_quiz_id_slug_unique" UNIQUE("quiz_id","slug"),
	CONSTRAINT "question_slug_slug" CHECK ("slug" ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
--> statement-breakpoint
CREATE TABLE "question_option" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"question_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"text" text NOT NULL,
	"is_correct" boolean NOT NULL,
	CONSTRAINT "question_option_question_id_position_unique" UNIQUE("question_id","position"),
	CONSTRAINT "question_option_question_id_text_unique" UNIQUE("question_id","text"),
	CONSTRAINT "question_option_position_range" CHECK ("position" BETWEEN 0 AND 5)
);
--> statement-breakpoint
CREATE TABLE "quiz" (
	"id" text PRIMARY KEY,
	"owner_id" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"exam_question_count" integer,
	"exam_minutes" integer,
	"exam_pass_percent" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quiz_id_slug" CHECK ("id" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
	CONSTRAINT "quiz_exam_all_or_none" CHECK (("exam_question_count" IS NULL) = ("exam_minutes" IS NULL) AND ("exam_minutes" IS NULL) = ("exam_pass_percent" IS NULL)),
	CONSTRAINT "quiz_exam_ranges" CHECK ("exam_question_count" >= 1 AND "exam_minutes" >= 1 AND "exam_pass_percent" BETWEEN 1 AND 100)
);
--> statement-breakpoint
CREATE INDEX "exam_session_pick_option_id_idx" ON "exam_session_pick" ("option_id");--> statement-breakpoint
CREATE INDEX "exam_session_question_question_id_idx" ON "exam_session_question" ("question_id");--> statement-breakpoint
CREATE INDEX "question_flag_question_id_idx" ON "question_flag" ("question_id");--> statement-breakpoint
CREATE INDEX "quiz_attempt_user_quiz_idx" ON "quiz_attempt" ("user_id","quiz_id","kind","chapter_id","finished_at");--> statement-breakpoint
CREATE INDEX "question_chapter_id_idx" ON "question" ("chapter_id");--> statement-breakpoint
CREATE INDEX "quiz_owner_id_idx" ON "quiz" ("owner_id");--> statement-breakpoint
ALTER TABLE "exam_session" ADD CONSTRAINT "exam_session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "exam_session" ADD CONSTRAINT "exam_session_quiz_id_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "exam_session_pick" ADD CONSTRAINT "exam_session_pick_option_id_question_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "question_option"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "exam_session_pick" ADD CONSTRAINT "exam_session_pick_question_fkey" FOREIGN KEY ("session_id","position") REFERENCES "exam_session_question"("session_id","position") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "exam_session_question" ADD CONSTRAINT "exam_session_question_session_id_exam_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "exam_session"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "exam_session_question" ADD CONSTRAINT "exam_session_question_question_id_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "question_flag" ADD CONSTRAINT "question_flag_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "question_flag" ADD CONSTRAINT "question_flag_question_id_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "quiz_attempt" ADD CONSTRAINT "quiz_attempt_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "quiz_attempt" ADD CONSTRAINT "quiz_attempt_quiz_id_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "quiz_attempt" ADD CONSTRAINT "quiz_attempt_chapter_fkey" FOREIGN KEY ("chapter_id","quiz_id") REFERENCES "chapter"("id","quiz_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_quiz_exam_settings" ADD CONSTRAINT "user_quiz_exam_settings_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "user_quiz_exam_settings" ADD CONSTRAINT "user_quiz_exam_settings_quiz_id_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "chapter" ADD CONSTRAINT "chapter_quiz_id_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quiz"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "question_chapter_fkey" FOREIGN KEY ("chapter_id","quiz_id") REFERENCES "chapter"("id","quiz_id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "question_option" ADD CONSTRAINT "question_option_question_id_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_owner_id_user_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE CASCADE;