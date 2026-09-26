ALTER TABLE "guests" ADD COLUMN "table_id" uuid;--> statement-breakpoint
ALTER TABLE "guests" ADD COLUMN "seat_index" integer;--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "guests_table_seat_unique" ON "guests" USING btree ("table_id","seat_index") WHERE "guests"."table_id" is not null;