CREATE TABLE problems_backup AS SELECT * FROM problems;
DELETE FROM problems;

CREATE TABLE "solutions" (
	"solution_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text
);
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_userName_unique";--> statement-breakpoint
ALTER TABLE "problems" DROP COLUMN "problemId";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "problems" ADD COLUMN "problem_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_name" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "userName";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_name_unique" UNIQUE("user_name");

INSERT INTO problems (title, "desc", slug) SELECT title,"desc",slug FROM problems_backup;
