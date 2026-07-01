import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoryCards from "@/components/home/CategoryCards";
import TrendingGrid from "@/components/home/TrendingGrid";
import BrandStory from "@/components/home/BrandStory";
import NewsletterCTA from "@/components/home/NewsletterCTA";
import PageTransition from "@/components/shared/PageTransition";

export default function HomePage() {
  return (
    <PageTransition>
      <HeroSection />
      <StatsSection />
      <FeaturedProducts />
      <CategoryCards />
      <TrendingGrid />
      <BrandStory />
      <NewsletterCTA />
    </PageTransition>
  );
}
