ALTER TABLE "problems" DROP CONSTRAINT "problems_title_unique";--> statement-breakpoint
ALTER TABLE "problems" ADD COLUMN "slug" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_slug_unique" UNIQUE("slug");