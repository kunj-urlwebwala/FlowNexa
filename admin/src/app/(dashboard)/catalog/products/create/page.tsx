"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FormWizard from "@/components/shared/FormWizard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MediaUploader from "@/components/shared/MediaUploader";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { toast } from "sonner";
import { Plus, Trash2, ShieldCheck, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VariantRow {
  color: string;
  size: string;
  stock: number;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Audio & Acoustics");
  const [subCategory, setSubCategory] = useState("Headphones");
  const [brand, setBrand] = useState("FlowNexa");
  
  // Variants State
  const [variants, setVariants] = useState<VariantRow[]>([{ color: "Matte Black", size: "Standard", stock: 10 }]);

  // Pricing State
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [taxRate, setTaxRate] = useState("18");

  // Inventory State
  const [warehouse, setWarehouse] = useState("SF Logistics Center");
  const [minStock, setMinStock] = useState("5");
  const [maxStock, setMaxStock] = useState("100");
  const [batchNo, setBatchNo] = useState(`BT-${Math.floor(100000 + Math.random() * 900000)}`);

  // SEO State
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  // Additional Specifications
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");
  const [specs, setSpecs] = useState<Record<string, string>>({
    "Warranty": "2 Years Manufacturer Warranty",
    "Package Contents": "Device, Charging Cable, User Manual"
  });

  const steps = [
    { title: "Basic Info", subtitle: "Name, brand and description" },
    { title: "Variants", subtitle: "Define product variables" },
    { title: "Pricing & Tax", subtitle: "Cost bases and tax rates" },
    { title: "Inventory", subtitle: "Warehouse and limits" },
    { title: "Media Upload", subtitle: "Images and gallery" },
    { title: "SEO parameters", subtitle: "Meta tag configurations" },
    { title: "Specifications", subtitle: "Spec sheet and shipping details" },
  ];

  const addVariantRow = () => {
    setVariants([...variants, { color: "White", size: "Standard", stock: 10 }]);
  };

  const removeVariantRow = (idx: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== idx));
    }
  };

  const updateVariantRow = (idx: number, field: keyof VariantRow, val: any) => {
    const updated = variants.map((v, i) => {
      if (i === idx) {
        return { ...v, [field]: val };
      }
      return v;
    });
    setVariants(updated);
  };

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
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    toast.success("Product Created Successfully!", {
      description: `${name} has been added with SKU ${sku || "N/A"}.`,
    });
    router.push("/catalog/products");
  };

  // Basic step validation checks
  const isStepValid = () => {
    if (currentStep === 0) return name.length > 2;
    if (currentStep === 2) return costPrice.length > 0 && sellingPrice.length > 0;
    return true;
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col gap-1 text-left select-none">
        <h1 className="text-2xl font-bold font-heading text-white">Create New Catalog Product</h1>
        <p className="text-xs text-muted-foreground">
          Step-by-step setup for variants, dimensions, pricing brackets, and SEO metadata.
        </p>
      </div>

      {/* Form Wizard wrapper */}
      <FormWizard
        currentStep={currentStep}
        steps={steps}
        onStepChange={setCurrentStep}
        onSubmit={handleSubmitWizard}
        isValid={isStepValid()}
        isSubmitting={isSubmitting}
      >
        <div className="text-left flex flex-col gap-6">
          
          {/* Step 1: Basic Information */}
          {currentStep === 0 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-white">Product Name*</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      // Auto SKU generator
                      const skuVal = e.target.value.slice(0, 3).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);
                      setSku(skuVal);
                    }}
                    placeholder="e.g. Orizon Wireless Pro"
                    className="bg-[#1A1D26] border-white/5 text-xs h-10"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sku" className="text-xs font-semibold text-white">Stock Keeping Unit (SKU)*</Label>
                  <Input
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Auto Generated"
                    className="bg-[#1A1D26] border-white/5 text-xs h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="category" className="text-xs font-semibold text-white">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-[#1A1D26] border-white/5 text-xs h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1D26] border border-white/5 text-white text-xs font-sans">
                      <SelectItem value="Audio & Acoustics">Audio & Acoustics</SelectItem>
                      <SelectItem value="Smart Wearables">Smart Wearables</SelectItem>
                      <SelectItem value="Tech Accessories">Tech Accessories</SelectItem>
                      <SelectItem value="Premium Devices">Premium Devices</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="subcategory" className="text-xs font-semibold text-white">Sub Category</Label>
                  <Select value={subCategory} onValueChange={setSubCategory}>
                    <SelectTrigger className="bg-[#1A1D26] border-white/5 text-xs h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1D26] border border-white/5 text-white text-xs font-sans">
                      <SelectItem value="Headphones">Headphones</SelectItem>
                      <SelectItem value="Earbuds">Earbuds</SelectItem>
                      <SelectItem value="Chargers">Chargers</SelectItem>
                      <SelectItem value="Virtual Reality">Virtual Reality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="brand" className="text-xs font-semibold text-white">Brand Name</Label>
                  <Input
                    id="brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="FlowNexa"
                    className="bg-[#1A1D26] border-white/5 text-xs h-10"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-white">Description (Rich Text)</Label>
                <RichTextEditor content={description} onChange={setDescription} />
              </div>
            </div>
          )}

          {/* Step 2: Variants */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-heading font-bold text-xs text-white">Product Variants Grid</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariantRow}
                  className="rounded-xl border-white/5 bg-white/5 text-white hover:bg-white/10 text-xs h-8 gap-1.5 cursor-pointer"
                >
                  <Plus size={12} />
                  Add Variant Row
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3 items-center bg-white/2 border border-white/5 p-3 rounded-xl">
                    <div className="flex-1 flex flex-col gap-1.5 w-full">
                      <Label className="text-[10px] text-muted-foreground uppercase font-bold">Color swatch</Label>
                      <Input
                        value={v.color}
                        onChange={(e) => updateVariantRow(idx, "color", e.target.value)}
                        placeholder="Royal Blue"
                        className="bg-[#1A1D26] border-white/5 text-xs h-9"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5 w-full">
                      <Label className="text-[10px] text-muted-foreground uppercase font-bold">Size Class</Label>
                      <Input
                        value={v.size}
                        onChange={(e) => updateVariantRow(idx, "size", e.target.value)}
                        placeholder="Standard"
                        className="bg-[#1A1D26] border-white/5 text-xs h-9"
                      />
                    </div>
                    <div className="w-full sm:w-[120px] flex flex-col gap-1.5">
                      <Label className="text-[10px] text-muted-foreground uppercase font-bold">Initial Qty</Label>
                      <Input
                        type="number"
                        value={v.stock}
                        onChange={(e) => updateVariantRow(idx, "stock", Number(e.target.value))}
                        className="bg-[#1A1D26] border-white/5 text-xs h-9"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeVariantRow(idx)}
                      disabled={variants.length === 1}
                      className="mt-5 text-red-400 hover:text-red-300 hover:bg-red-500/10 size-9 p-0 rounded-xl cursor-pointer disabled:opacity-20"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Pricing & Taxes */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="costPrice" className="text-xs font-semibold text-white">Cost Price ($)*</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="120"
                    className="bg-[#1A1D26] border-white/5 text-xs h-10"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="sellingPrice" className="text-xs font-semibold text-white">Selling Price ($)*</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="299"
                    className="bg-[#1A1D26] border-white/5 text-xs h-10"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="taxRate" className="text-xs font-semibold text-white">GST Tax Bracket (%)</Label>
                  <Select value={taxRate} onValueChange={setTaxRate}>
                    <SelectTrigger className="bg-[#1A1D26] border-white/5 text-xs h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1D26] border border-white/5 text-white text-xs font-sans">
                      <SelectItem value="5">5% GST (Standard Essentials)</SelectItem>
                      <SelectItem value="12">12% GST (Electronics & Mobiles)</SelectItem>
                      <SelectItem value="18">18% GST (Laptops & Acoustics)</SelectItem>
                      <SelectItem value="28">28% GST (Luxury Items)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Inventory Logistics */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="warehouse" className="text-xs font-semibold text-white">Primary Warehouse</Label>
                  <Select value={warehouse} onValueChange={setWarehouse}>
                    <SelectTrigger className="bg-[#1A1D26] border-white/5 text-xs h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1D26] border border-white/5 text-white text-xs font-sans">
                      <SelectItem value="SF Logistics Center">SF Logistics Center (West Coast)</SelectItem>
                      <SelectItem value="NY East Hub">NY East Hub (East Coast)</SelectItem>
                      <SelectItem value="Chicago Midwest">Chicago Midwest (Central Region)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="batchNo" className="text-xs font-semibold text-white">Initial Batch Number</Label>
                  <Input
                    id="batchNo"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    placeholder="BT-847291"
                    className="bg-[#1A1D26] border-white/5 text-xs h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="minStock" className="text-xs font-semibold text-white">Minimum Alert Threshold (Qty)</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    placeholder="5"
                    className="bg-[#1A1D26] border-white/5 text-xs h-10"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="maxStock" className="text-xs font-semibold text-white">Maximum Bin Capacity (Qty)</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    value={maxStock}
                    onChange={(e) => setMaxStock(e.target.value)}
                    placeholder="100"
                    className="bg-[#1A1D26] border-white/5 text-xs h-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Media Upload */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              <Label className="text-xs font-semibold text-white">Drop Product Images</Label>
              <MediaUploader maxFiles={5} />
            </div>
          )}

          {/* Step 6: SEO Parameters */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="metaTitle" className="text-xs font-semibold text-white">SEO Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={name ? `${name} | FlowNexa` : "SEO Meta Title"}
                  className="bg-[#1A1D26] border-white/5 text-xs h-10"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="metaDesc" className="text-xs font-semibold text-white">SEO Meta Description</Label>
                <Textarea
                  id="metaDesc"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Summarize product features for search engine crawling indexing..."
                  className="bg-[#1A1D26] border-white/5 text-xs h-24"
                />
              </div>
            </div>
          )}

          {/* Step 7: Specifications */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2.5">
                <Label className="text-xs font-semibold text-white">Specification sheet parameters</Label>
                
                {/* Add dynamic spec panel */}
                <div className="flex gap-2 items-center bg-white/2 border border-white/5 p-3 rounded-xl">
                  <Input
                    placeholder="Dimension Size"
                    value={specKey}
                    onChange={(e) => setSpecKey(e.target.value)}
                    className="bg-[#1A1D26] border-white/5 text-xs h-9 flex-1"
                  />
                  <Input
                    placeholder="40mm Driver"
                    value={specVal}
                    onChange={(e) => setSpecVal(e.target.value)}
                    className="bg-[#1A1D26] border-white/5 text-xs h-9 flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addSpec}
                    className="rounded-xl bg-flownexa-lime text-flownexa-black font-semibold text-xs h-9 px-3 cursor-pointer shrink-0"
                  >
                    Add Parameter
                  </Button>
                </div>

                {/* List specs */}
                <div className="flex flex-col gap-2 mt-2">
                  {Object.entries(specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center bg-white/3 border border-white/5 p-3 rounded-xl text-xs">
                      <div>
                        <strong className="text-white">{key}:</strong>{" "}
                        <span className="text-muted-foreground">{val}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeSpec(key)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 size-7 p-0 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </FormWizard>

    </div>
  );
}
