CREATE TABLE `product_variants` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`name` text NOT NULL,
	`model_type` text NOT NULL,
	`color` text DEFAULT '#7b8cff',
	`price_delta` real DEFAULT 0,
	`is_default` integer DEFAULT false
);
