CREATE TABLE "entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"habbit_id" uuid NOT NULL,
	"completion_date" timestamp DEFAULT now() NOT NULL,
	"note" text,
	"creadtedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habbitTags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"habbit_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"creadtedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habbits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"frequency" varchar(20) NOT NULL,
	"target_count" integer DEFAULT 1,
	"is_active" boolean DEFAULT true NOT NULL,
	"creadtedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"color" varchar(7) DEFAULT '#',
	"creadtedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tages_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(50) NOT NULL,
	"password" varchar(255) NOT NULL,
	"first_name" varchar(50),
	"last_name" varchar(50),
	"creadtedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "entries" ADD CONSTRAINT "entries_habbit_id_habbits_id_fk" FOREIGN KEY ("habbit_id") REFERENCES "public"."habbits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habbitTags" ADD CONSTRAINT "habbitTags_habbit_id_habbits_id_fk" FOREIGN KEY ("habbit_id") REFERENCES "public"."habbits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habbitTags" ADD CONSTRAINT "habbitTags_tag_id_tages_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "habbits" ADD CONSTRAINT "habbits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;