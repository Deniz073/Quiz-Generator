CREATE INDEX "exam_session_quiz_id_idx" ON "exam_session" ("quiz_id");--> statement-breakpoint
CREATE INDEX "quiz_attempt_quiz_id_idx" ON "quiz_attempt" ("quiz_id");--> statement-breakpoint
CREATE INDEX "quiz_attempt_chapter_id_idx" ON "quiz_attempt" ("chapter_id");--> statement-breakpoint
CREATE INDEX "user_quiz_exam_settings_quiz_id_idx" ON "user_quiz_exam_settings" ("quiz_id");