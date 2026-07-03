"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormWizard from "@/components/shared/FormWizard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MediaUploader from "@/components/shared/MediaUploader";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";


interface VariantRow {
  color: string;
  size: string;
  stock: number;
}

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
}

interface BrandRecord {
  id: string;
  name: string;
  slug: string;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [brands, setBrands] = useState<BrandRecord[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [uploadedImages] = useState<string[]>([]);

  // Form State
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [taxRate, setTaxRate] = useState("18");
  const [isActive, setIsActive] = useState(true);

  // Variants State
  const [variants, setVariants] = useState<VariantRow[]>([{ color: "Matte Black", size: "Standard", stock: 10 }]);

  // Pricing State
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  // Inventory State
  const [warehouse, setWarehouse] = useState("SF Logistics Center");
  const [minStock, setMinStock] = useState("5");
  const [maxStock, setMaxStock] = useState("100");
  const [batchNo, setBatchNo] = useState(() => `BT-${Math.floor(100000 + Math.random() * 900000)}`);

  // SEO State
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // Specifications
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");
  const [specs, setSpecs] = useState<Record<string, string>>({
    "Warranty": "2 Years Manufacturer Warranty",
    "Package Contents": "Device, Charging Cable, User Manual",
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [cats, brs] = await Promise.all([
          api.get<CategoryRecord[]>("/categories").catch(() => []),
          api.get<BrandRecord[]>("/brands").catch(() => []),
        ]);
        setCategories(Array.isArray(cats) ? cats : []);
        setBrands(Array.isArray(brs) ? brs : []);
      } catch {
        // Silent
      }
    };
    fetchOptions();
  }, []);

  const steps = [
    { title: "Basic Info", subtitle: "Name, brand and description" },
    { title: "Variants", subtitle: "Define product variables" },
    { title: "Pricing & Tax", subtitle: "Cost bases and tax rates" },
    { title: "Inventory", subtitle: "Warehouse and limits" },
    { title: "Media Upload", subtitle: "Images and gallery" },
    { title: "SEO parameters", subtitle: "Meta tag configurations" },
    { title: "Specifications", subtitle: "Spec sheet and shipping details" },
  ];

  const addVariantRow = () => setVariants([...variants, { color: "White", size: "Standard", stock: 10 }]);
  const removeVariantRow = (idx: number) => { if (variants.length > 1) setVariants(variants.filter((_, i) => i !== idx)); };
  const updateVariantRow = (idx: number, field: keyof VariantRow, val: string | number) =>
    setVariants(variants.map((v, i) => i === idx ? { ...v, [field]: val } : v));

  const addSpec = () => {
    if (specKey && specVal) {
      setSpecs({ ...specs, [specKey]: specVal });
      setSpecKey("");
      setSpecVal("");
    }
  };

  const removeSpec = (key: string) => {
    const newSpecs = { ...specs };
    delete newSpecs[key];
    setSpecs(newSpecs);
  };

  const handleSubmitWizard = async () => {
    if (!categoryId) {
      toast.error("Category is required");
      setCurrentStep(0);
      return;
    }
    if (!sellingPrice || parseFloat(sellingPrice) <= 0) {
      toast.error("Selling price is required");
      setCurrentStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/products", {
        name,
        description,
        price: parseFloat(sellingPrice),
        compareAtPrice: costPrice ? parseFloat(costPrice) : undefined,
        categoryId,
        brandId: brandId || undefined,
        images: uploadedImages.length > 0 ? uploadedImages : [],
        isActive,
        variants: variants.map((v) => ({
          name: `${v.color} - ${v.size}`,
          stock: v.stock,
        })),
      });

      toast.success("Product Created Successfully!", { description: `${name} has been added.` });
      router.push("/catalog/products");
    } catch (err: unknown) {
      toast.error("Failed to create product", { description: err instanceof Error ? err.message : "Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (currentStep === 0) return name.length > 2;
    if (currentStep === 2) return sellingPrice.length > 0;
    return true;
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex flex-col gap-1 text-left select-none">
        <h1 className="text-2xl font-bold font-heading text-white">Create New Catalog Product</h1>
        <p className="text-xs text-muted-foreground">Step-by-step setup for variants, pricing, and SEO metadata.</p>
      </div>

      <FormWizard currentStep={currentStep} steps={steps} onStepChange={setCurrentStep} onSubmit={handleSubmitWizard} isValid={isStepValid()} isSubmitting={isSubmitting}>
        <div className="text-left flex flex-col gap-6">

          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-white">Product Name*</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Orizon Wireless Pro" className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-white">SKU</Label>
                  <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="Auto Generated" className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-white">Category*</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="bg-[#1A1D26] border-white/5 text-xs h-10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1D26] border border-white/5 text-white text-xs font-sans">
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-white">Brand</Label>
                  <Select value={brandId} onValueChange={setBrandId}>
                    <SelectTrigger className="bg-[#1A1D26] border-white/5 text-xs h-10">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1D26] border border-white/5 text-white text-xs font-sans">
                      {brands.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-white">Status</Label>
                  <Select value={isActive ? "active" : "draft"} onValueChange={(v) => setIsActive(v === "active")}>
                    <SelectTrigger className="bg-[#1A1D26] border-white/5 text-xs h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1D26] border border-white/5 text-white text-xs font-sans">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-white">Description</Label>
                <RichTextEditor content={description} onChange={setDescription} />
              </div>
            </div>
          )}

          {/* Step 2: Variants */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-heading font-bold text-xs text-white">Product Variants</h3>
                <Button type="button" variant="outline" size="sm" onClick={addVariantRow}
                  className="rounded-xl border-white/5 bg-white/5 text-white hover:bg-white/10 text-xs h-8 gap-1.5 cursor-pointer">
                  <Plus size={12} /> Add Variant
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3 items-center bg-white/2 border border-white/5 p-3 rounded-xl">
                    <div className="flex-1 flex flex-col gap-1.5 w-full">
                      <Label className="text-[10px] text-muted-foreground uppercase font-bold">Color</Label>
                      <Input value={v.color} onChange={(e) => updateVariantRow(idx, "color", e.target.value)} placeholder="Matte Black" className="bg-[#1A1D26] border-white/5 text-xs h-9" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5 w-full">
                      <Label className="text-[10px] text-muted-foreground uppercase font-bold">Size</Label>
                      <Input value={v.size} onChange={(e) => updateVariantRow(idx, "size", e.target.value)} placeholder="Standard" className="bg-[#1A1D26] border-white/5 text-xs h-9" />
                    </div>
                    <div className="w-full sm:w-[120px] flex flex-col gap-1.5">
                      <Label className="text-[10px] text-muted-foreground uppercase font-bold">Qty</Label>
                      <Input type="number" value={v.stock} onChange={(e) => updateVariantRow(idx, "stock", Number(e.target.value))} className="bg-[#1A1D26] border-white/5 text-xs h-9" />
                    </div>
                    <Button type="button" variant="ghost" onClick={() => removeVariantRow(idx)} disabled={variants.length === 1}
                      className="mt-5 text-red-400 hover:text-red-300 hover:bg-red-500/10 size-9 p-0 rounded-xl cursor-pointer disabled:opacity-20">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-white">Cost Price (₹)</Label>
                  <Input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="120" className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-white">Selling Price (₹)*</Label>
                  <Input type="number" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} placeholder="299" className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-white">GST Tax (%)</Label>
                  <Select value={taxRate} onValueChange={setTaxRate}>
                    <SelectTrigger className="bg-[#1A1D26] border-white/5 text-xs h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1D26] border border-white/5 text-white text-xs font-sans">
                      <SelectItem value="5">5% GST</SelectItem>
                      <SelectItem value="12">12% GST</SelectItem>
                      <SelectItem value="18">18% GST</SelectItem>
                      <SelectItem value="28">28% GST</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Inventory */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-white">Primary Warehouse</Label>
                  <Select value={warehouse} onValueChange={setWarehouse}>
                    <SelectTrigger className="bg-[#1A1D26] border-white/5 text-xs h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1D26] border border-white/5 text-white text-xs font-sans">
                      <SelectItem value="SF Logistics Center">SF Logistics Center</SelectItem>
                      <SelectItem value="NY East Hub">NY East Hub</SelectItem>
                      <SelectItem value="Chicago Midwest">Chicago Midwest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-white">Batch Number</Label>
                  <Input value={batchNo} onChange={(e) => setBatchNo(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-white">Min Stock Alert</Label>
                  <Input type="number" value={minStock} onChange={(e) => setMinStock(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-white">Max Stock Capacity</Label>
                  <Input type="number" value={maxStock} onChange={(e) => setMaxStock(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Media Upload */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              <Label className="text-xs font-semibold text-white">Product Images</Label>
              <MediaUploader maxFiles={5} />
              <p className="text-[10px] text-muted-foreground">Uploaded images will be linked to this product on save.</p>
            </div>
          )}

          {/* Step 6: SEO */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-white">Meta Title</Label>
                <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder={name ? `${name} | FlowNexa` : "SEO Meta Title"} className="bg-[#1A1D26] border-white/5 text-xs h-10" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-white">Meta Description</Label>
                <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Product features for search engines..." className="bg-[#1A1D26] border-white/5 text-xs h-24" />
              </div>
            </div>
          )}

          {/* Step 7: Specifications */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-4">
              <Label className="text-xs font-semibold text-white">Specifications</Label>
              <div className="flex gap-2 items-center bg-white/2 border border-white/5 p-3 rounded-xl">
                <Input placeholder="Key" value={specKey} onChange={(e) => setSpecKey(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-9 flex-1" />
                <Input placeholder="Value" value={specVal} onChange={(e) => setSpecVal(e.target.value)} className="bg-[#1A1D26] border-white/5 text-xs h-9 flex-1" />
                <Button type="button" onClick={addSpec} className="rounded-xl bg-flownexa-lime text-flownexa-black font-semibold text-xs h-9 px-3 cursor-pointer shrink-0">
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {Object.entries(specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center bg-white/3 border border-white/5 p-3 rounded-xl text-xs">
                    <div>
                      <strong className="text-white">{key}:</strong>{" "}
                      <span className="text-muted-foreground">{val}</span>
                    </div>
                    <Button type="button" variant="ghost" onClick={() => removeSpec(key)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 size-7 p-0 rounded-lg cursor-pointer">
                      <Trash2 size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </FormWizard>
    </div>
  );
}
