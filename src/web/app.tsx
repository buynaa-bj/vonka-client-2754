import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./styles.css";
import { Navbar } from "./components/Navbar";
import { CartDrawer } from "./components/CartDrawer";
import { HeroSection } from "./pages/HeroSection";
import { ProductsSection } from "./pages/ProductsSection";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { GallerySection } from "./pages/GallerySection";
import { AboutSection } from "./pages/AboutSection";
import { OrderSection } from "./pages/OrderSection";
import { ContactSection } from "./pages/ContactSection";
import { Footer } from "./pages/Footer";
import { useCart } from "./hooks/useCart";

type View = { type: "home" } | { type: "product"; id: number };

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [view, setView] = useState<View>({ type: "home" });
  const { items, total, clearCart } = useCart();

  const handleCheckout = () => {
    setCartOpen(false);
    if (view.type !== "home") {
      setView({ type: "home" });
      setTimeout(() => {
        document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    } else {
      document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goToProduct = (id: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setView({ type: "product", id }), 200);
  };

  const goHome = () => {
    setView({ type: "home" });
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#080810]">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <AnimatePresence mode="wait">
        {view.type === "home" ? (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HeroSection />
            <ProductsSection onViewDetail={goToProduct} />
            <GallerySection />
            <AboutSection />
            <OrderSection cartItems={items} cartTotal={total} onClearCart={clearCart} />
            <ContactSection />
            <Footer />
          </motion.main>
        ) : (
          <motion.div
            key={`product-${view.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductDetailPage productId={view.id} onBack={goHome} />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
