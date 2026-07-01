"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import SectionHeader from "@/components/shared/SectionHeader";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Grid, List, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Route Param Filters
  const paramCategory = searchParams.get("category");
  const paramFeatured = searchParams.get("featured");

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Load initial params
  useEffect(() => {
    if (paramCategory) {
      setSelectedCategories([paramCategory]);
    } else {
      setSelectedCategories([]);
    }
  }, [paramCategory]);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Apply filters & sorting
  useEffect(() => {
    let result = [...products];

    // Filter by categories
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Filter by featured
    if (paramFeatured === "true") {
      result = result.filter((p) => p.featured);
    }

    // Filter by price
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // Default: featured first, then name
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(result);
  }, [selectedCategories, priceRange, sortBy, paramFeatured]);

  const handleCategoryToggle = (categorySlug: string) => {
    if (selectedCategories.includes(categorySlug)) {
      const updated = selectedCategories.filter((slug) => slug !== categorySlug);
      setSelectedCategories(updated);
      // Remove param if it was set
      if (paramCategory === categorySlug) {
        router.push("/products");
      }
    } else {
      setSelectedCategories([...selectedCategories, categorySlug]);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setSortBy("featured");
    router.push("/products");
  };

  const FilterPanel = () => (
    <div className="flex flex-col gap-6 text-white font-sans">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Categories
        </h3>
        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <div key={cat.slug} className="flex items-center gap-3">
              <Checkbox
                id={`cat-${cat.slug}`}
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => handleCategoryToggle(cat.slug)}
                className="border-white/20 data-[state=checked]:bg-flownexa-lime data-[state=checked]:text-flownexa-black"
              />
              <Label
                htmlFor={`cat-${cat.slug}`}
                className="text-sm text-muted-foreground hover:text-white cursor-pointer select-none"
              >
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 pt-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex justify-between items-center">
          <span>Price Range</span>
          <span className="text-flownexa-lime font-mono text-[11px]">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </h3>
        <Slider
          defaultValue={[0, 1000]}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="text-flownexa-lime"
        />
      </div>

      <div className="border-t border-white/5 pt-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Sort Products
        </h3>
        <RadioGroup value={sortBy} onValueChange={setSortBy} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value="featured"
              id="sort-feat"
              className="border-white/20 data-[state=checked]:border-flownexa-lime data-[state=checked]:text-flownexa-lime"
            />
            <Label htmlFor="sort-feat" className="text-sm text-muted-foreground cursor-pointer">
              Featured / Spotlight
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value="price-asc"
              id="sort-p-asc"
              className="border-white/20 data-[state=checked]:border-flownexa-lime data-[state=checked]:text-flownexa-lime"
            />
            <Label htmlFor="sort-p-asc" className="text-sm text-muted-foreground cursor-pointer">
              Price: Low to High
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value="price-desc"
              id="sort-p-desc"
              className="border-white/20 data-[state=checked]:border-flownexa-lime data-[state=checked]:text-flownexa-lime"
            />
            <Label htmlFor="sort-p-desc" className="text-sm text-muted-foreground cursor-pointer">
              Price: High to Low
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem
              value="rating"
              id="sort-rate"
              className="border-white/20 data-[state=checked]:border-flownexa-lime data-[state=checked]:text-flownexa-lime"
            />
            <Label htmlFor="sort-rate" className="text-sm text-muted-foreground cursor-pointer">
              Customer Rating
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        variant="outline"
        onClick={handleClearFilters}
        className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 font-semibold mt-4 py-5"
      >
        Reset All Filters
      </Button>
    </div>
  );

  return (
    <PageTransition>
      <div className="bg-flownexa-black text-white min-h-screen py-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          
          {/* Page Title */}
          <SectionHeader
            title="Explore Products"
            subtitle="Browse our comprehensive directory of sleek, high-end electronics and audio devices."
            badge="Catalogue"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start mt-6">
            
            {/* Desktop Filters Sidebar (Left Column) */}
            <aside className="hidden lg:block lg:col-span-1 bg-zinc-900 border border-white/5 rounded-3xl p-6 sticky top-24">
              <FilterPanel />
            </aside>

            {/* Products Grid / Listing (Right Column) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              
              {/* Toolbar */}
              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
                
                {/* Mobile Filter Sheet Trigger */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden gap-2 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl">
                      <SlidersHorizontal size={14} />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="bg-flownexa-black text-white border-r border-white/10 p-6 w-[280px]">
                    <SheetHeader className="pb-4 border-b border-white/10 mb-6">
                      <SheetTitle className="text-white text-left font-bold font-heading text-lg">
                        Catalog Filters
                      </SheetTitle>
                    </SheetHeader>
                    <FilterPanel />
                  </SheetContent>
                </Sheet>

                <p className="text-xs text-muted-foreground">
                  Showing <strong className="text-white">{filteredProducts.length}</strong> of {products.length} products
                </p>

                {/* Grid/List views toggles */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={`size-8 rounded-lg hover:bg-white/5 ${viewMode === "grid" ? "text-flownexa-lime bg-white/5" : "text-muted-foreground"}`}
                  >
                    <Grid size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={`size-8 rounded-lg hover:bg-white/5 ${viewMode === "list" ? "text-flownexa-lime bg-white/5" : "text-muted-foreground"}`}
                  >
                    <List size={16} />
                  </Button>
                </div>
              </div>

              {/* Products Container */}
              {filteredProducts.length === 0 ? (
                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl py-20 px-6 text-center flex flex-col items-center justify-center">
                  <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mb-4">
                    <SlidersHorizontal size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">No products matched</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-6">
                    Try broadening your search query or adjusting your filters to discover matching products.
                  </p>
                  <Button onClick={handleClearFilters} className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover">
                    Reset Filter Parameters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="bg-flownexa-black text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin size-8 rounded-full border-4 border-t-flownexa-lime border-white/10" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
