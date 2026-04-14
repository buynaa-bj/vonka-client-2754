import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { products, productVariants, orders, gallery } from "./database/schema";
import { eq, desc } from "drizzle-orm";

type Bindings = { DB: D1Database };
const app = new Hono<{ Bindings: Bindings }>();

// Seed
app.use("/api/*", async (c, next) => {
  const db = drizzle(c.env.DB);
  const existing = await db.select().from(products).limit(1);
  if (existing.length === 0) {
    // Products
    const inserted = await db.insert(products).values([
      { name: "Dragon Figurine", description: "Хэт нарийн detail бүхий луу дүрс. Collector grade.", price: 45000, category: "figurine", modelType: "figurine", featured: true, inStock: true },
      { name: "Engine Prototype", description: "Инженерийн нарийвчлалтай прототип. FDM + SLA хослол.", price: 80000, category: "prototype", modelType: "box", featured: true, inStock: true },
      { name: "Phone Case X", description: "Custom phone case. Хүссэн дизайн, textureтэй.", price: 25000, category: "phone-case", modelType: "phone", featured: false, inStock: true },
      { name: "Gear Assembly", description: "Механик хэсгүүд. Хэдэн мм-ийн нарийвчлал.", price: 35000, category: "parts", modelType: "gear", featured: false, inStock: true },
      { name: "Crystal Sculpture", description: "Уран сайхны хөшөө баримал. Resin print.", price: 60000, category: "figurine", modelType: "sphere", featured: true, inStock: true },
      { name: "Arch Model", description: "Барилгын масштабын загвар. Архитекторт.", price: 120000, category: "prototype", modelType: "box", featured: false, inStock: true },
    ]).returning();

    // Variants for each product
    const variantData = [
      // Dragon Figurine: 3 variant
      { productId: inserted[0].id, name: "Classic", modelType: "figurine", color: "#c0c8e0", isDefault: true, priceDelta: 0 },
      { productId: inserted[0].id, name: "Gold Edition", modelType: "figurine", color: "#e8c060", isDefault: false, priceDelta: 10000 },
      { productId: inserted[0].id, name: "Dark Void", modelType: "figurine", color: "#3030a0", isDefault: false, priceDelta: 5000 },
      // Engine Prototype: 3 variant
      { productId: inserted[1].id, name: "Standard", modelType: "box", color: "#8899ee", isDefault: true, priceDelta: 0 },
      { productId: inserted[1].id, name: "High-Res", modelType: "box", color: "#a0c8ff", isDefault: false, priceDelta: 20000 },
      { productId: inserted[1].id, name: "Matte Black", modelType: "box", color: "#303040", isDefault: false, priceDelta: 8000 },
      // Phone Case: 3 variant
      { productId: inserted[2].id, name: "Clear", modelType: "phone", color: "#d0e8f8", isDefault: true, priceDelta: 0 },
      { productId: inserted[2].id, name: "Carbon", modelType: "phone", color: "#202030", isDefault: false, priceDelta: 5000 },
      { productId: inserted[2].id, name: "Neon", modelType: "phone", color: "#7b8cff", isDefault: false, priceDelta: 3000 },
      // Gear: 2 variant
      { productId: inserted[3].id, name: "Steel", modelType: "gear", color: "#e8e0d0", isDefault: true, priceDelta: 0 },
      { productId: inserted[3].id, name: "Titanium", modelType: "gear", color: "#a0b8d0", isDefault: false, priceDelta: 15000 },
      // Crystal: 3 variant
      { productId: inserted[4].id, name: "Crystal", modelType: "sphere", color: "#7b8cff", isDefault: true, priceDelta: 0 },
      { productId: inserted[4].id, name: "Rose", modelType: "sphere", color: "#e080a0", isDefault: false, priceDelta: 8000 },
      { productId: inserted[4].id, name: "Obsidian", modelType: "sphere", color: "#201830", isDefault: false, priceDelta: 5000 },
      // Arch: 2 variant
      { productId: inserted[5].id, name: "White", modelType: "box", color: "#f0f0f5", isDefault: true, priceDelta: 0 },
      { productId: inserted[5].id, name: "Concrete", modelType: "box", color: "#707080", isDefault: false, priceDelta: 10000 },
    ];

    await db.insert(productVariants).values(variantData);

    await db.insert(gallery).values([
      { title: "Dragon Figurine", category: "figurine" },
      { title: "Engine Part", category: "parts" },
      { title: "Phone Case v2", category: "phone-case" },
      { title: "Product Prototype", category: "prototype" },
      { title: "Custom Trophy", category: "figurine" },
      { title: "Mechanical Gear Set", category: "parts" },
    ]);
  }
  return next();
});

// GET /api/products — with variants
app.get("/api/products", async (c) => {
  const db = drizzle(c.env.DB);
  const allProducts = await db.select().from(products).orderBy(desc(products.featured));
  const allVariants = await db.select().from(productVariants);
  const result = allProducts.map((p) => ({
    ...p,
    variants: allVariants.filter((v) => v.productId === p.id),
  }));
  return c.json(result);
});

app.get("/api/products/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const id = parseInt(c.req.param("id"));
  const [product] = await db.select().from(products).where(eq(products.id, id));
  if (!product) return c.json({ error: "Not found" }, 404);
  const variants = await db.select().from(productVariants).where(eq(productVariants.productId, id));
  return c.json({ ...product, variants });
});

// POST /api/orders
app.post("/api/orders", async (c) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();
  const [order] = await db.insert(orders).values({
    name: body.name,
    email: body.email,
    phone: body.phone,
    description: body.description,
    orderType: body.orderType || "custom",
    items: body.items ? JSON.stringify(body.items) : null,
    total: body.total || 0,
    status: "pending",
  }).returning();
  return c.json({ success: true, orderId: order.id });
});

// GET /api/gallery
app.get("/api/gallery", async (c) => {
  const db = drizzle(c.env.DB);
  const all = await db.select().from(gallery);
  return c.json(all);
});

export default app;
