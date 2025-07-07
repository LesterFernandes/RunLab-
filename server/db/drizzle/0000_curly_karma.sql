CREATE TABLE "problems" (
	"problemId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(100) NOT NULL,
	"desc" text,
	CONSTRAINT "problems_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"userId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userName" varchar(100) NOT NULL,
	CONSTRAINT "users_userName_unique" UNIQUE("userName")
);
