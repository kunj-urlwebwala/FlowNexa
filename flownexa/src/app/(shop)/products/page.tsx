"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import SectionHeader from "@/components/shared/SectionHeader";
import PageTransition from "@/components/shared/PageTransition";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Grid, List, SlidersHorizontal, Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string;
  _count?: { products: number };
}

interface FilterPanelProps {
  categories: CategoryItem[];
  selectedCategories: string[];
  handleCategoryToggle: (slug: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  handleClearFilters: () => void;
}

function FilterPanel({
  categories,
  selectedCategories,
  handleCategoryToggle,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  handleClearFilters,
}: FilterPanelProps) {
  return (
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
            ₹{priceRange[0]} - ₹{priceRange[1]}
          </span>
        </h3>
        <Slider
          defaultValue={[0, 50000]}
          max={50000}
          step={500}
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
            <RadioGroupItem value="createdAt_desc" id="sort-newest" className="border-white/20 data-[state=checked]:border-flownexa-lime data-[state=checked]:text-flownexa-lime" />
            <Label htmlFor="sort-newest" className="text-sm text-muted-foreground cursor-pointer">Newest First</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="price_asc" id="sort-p-asc" className="border-white/20 data-[state=checked]:border-flownexa-lime data-[state=checked]:text-flownexa-lime" />
            <Label htmlFor="sort-p-asc" className="text-sm text-muted-foreground cursor-pointer">Price: Low to High</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="price_desc" id="sort-p-desc" className="border-white/20 data-[state=checked]:border-flownexa-lime data-[state=checked]:text-flownexa-lime" />
            <Label htmlFor="sort-p-desc" className="text-sm text-muted-foreground cursor-pointer">Price: High to Low</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="name_asc" id="sort-name" className="border-white/20 data-[state=checked]:border-flownexa-lime data-[state=checked]:text-flownexa-lime" />
            <Label htmlFor="sort-name" className="text-sm text-muted-foreground cursor-pointer">Name: A to Z</Label>
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
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramCategory = searchParams.get("category");
  const paramSearch = searchParams.get("search");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000]);
  const [sortBy, setSortBy] = useState<string>("createdAt_desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch categories
  useEffect(() => {
    api.get<CategoryItem[]>("/categories").then(setCategories).catch(() => {
      toast.error("Failed to load categories");
    });
  }, []);

  // Load initial category param
  useEffect(() => {
    if (paramCategory) {
      setSelectedCategories([paramCategory]); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [paramCategory]);

  // Fetch products from API
  const fetchProducts = useCallback(async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", pageNum.toString());
      params.set("limit", "20");

      if (paramSearch) params.set("search", paramSearch);
      if (selectedCategories.length === 1) params.set("category", selectedCategories[0]);
      if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
      if (priceRange[1] < 50000) params.set("maxPrice", priceRange[1].toString());
      if (sortBy) params.set("sortBy", sortBy);

      const result = await api.get<Product[]>(`/products?${params.toString()}`);
      if (reset) {
        setProducts(result || []);
      } else {
        setProducts((prev) => [...prev, ...(result || [])]);
      }
    } catch {
      toast.error("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [paramSearch, selectedCategories, priceRange, sortBy]);

  // Reset and fetch when filters change
  useEffect(() => {
    fetchProducts(1, true); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchProducts]);

  const handleCategoryToggle = (categorySlug: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categorySlug)) {
        return prev.filter((s) => s !== categorySlug);
      }
      return [...prev, categorySlug];
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 50000]);
    setSortBy("createdAt_desc");
    router.push("/products");
  };

  return (
    <PageTransition>
      <div className="bg-flownexa-black text-white min-h-screen py-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <SectionHeader
            title="Explore Products"
            subtitle="Browse our comprehensive directory of sleek, high-end electronics and audio devices."
            badge="Catalogue"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start mt-6">
            <aside className="hidden lg:block lg:col-span-1 bg-zinc-900 border border-white/5 rounded-3xl p-6 sticky top-24">
              <FilterPanel
                categories={categories}
                selectedCategories={selectedCategories}
                handleCategoryToggle={handleCategoryToggle}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                sortBy={sortBy}
                setSortBy={setSortBy}
                handleClearFilters={handleClearFilters}
              />
            </aside>

            <div className="lg:col-span-3 flex flex-col gap-6">
              <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
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
                    <FilterPanel
                      categories={categories}
                      selectedCategories={selectedCategories}
                      handleCategoryToggle={handleCategoryToggle}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                      handleClearFilters={handleClearFilters}
                    />
                  </SheetContent>
                </Sheet>

                <p className="text-xs text-muted-foreground">
                  Showing <strong className="text-white">{products.length}</strong> products
                </p>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setViewMode("grid")}
                    className={`size-8 rounded-lg hover:bg-white/5 ${viewMode === "grid" ? "text-flownexa-lime bg-white/5" : "text-muted-foreground"}`}>
                    <Grid size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setViewMode("list")}
                    className={`size-8 rounded-lg hover:bg-white/5 ${viewMode === "list" ? "text-flownexa-lime bg-white/5" : "text-muted-foreground"}`}>
                    <List size={16} />
                  </Button>
                </div>
              </div>

              {loading && products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="animate-spin text-flownexa-lime size-8 mb-3" />
                  <p className="text-xs text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl py-20 px-6 text-center flex flex-col items-center justify-center">
                  <div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground mb-4">
                    <SlidersHorizontal size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">No products found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-6">
                    Try adjusting your filters or search to discover products.
                  </p>
                  <Button onClick={handleClearFilters} className="rounded-full bg-flownexa-lime text-flownexa-black font-semibold hover:bg-flownexa-lime-hover">
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
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
