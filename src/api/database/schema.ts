import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  category: text("category").notNull(),
  image: text("image"),
  modelType: text("model_type").default("sphere"),
  inStock: integer("in_stock", { mode: "boolean" }).default(true),
  featured: integer("featured", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Product variants — нэг бараанд олон загвар
export const productVariants = sqliteTable("product_variants", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").notNull(),
  name: text("name").notNull(),
  modelType: text("model_type").notNull(),
  color: text("color").default("#7b8cff"),
  priceDelta: real("price_delta").default(0), // base price + delta
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  description: text("description").notNull(),
  orderType: text("order_type").notNull().default("custom"),
  items: text("items"),
  total: real("total").default(0),
  status: text("status").default("pending"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export const gallery = sqliteTable("gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  category: text("category").notNull(),
  image: text("image"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});
