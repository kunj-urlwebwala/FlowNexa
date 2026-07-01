import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileMenu from "@/components/layout/MobileMenu";
import SearchDialog from "@/components/layout/SearchDialog";
import CartDrawer from "@/components/layout/CartDrawer";

interface ShopLayoutProps {
  children: React.ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <AnnouncementBar />
      <Navbar />
      
      {/* Offset top layout for sticky navbar */}
      <main className="flex-1 flex flex-col pt-16">
        {children}
      </main>

      <Footer />

      {/* Global UI Overlays */}
      <MobileMenu />
      <SearchDialog />
      <CartDrawer />
    </div>
  );
}
