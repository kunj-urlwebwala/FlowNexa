"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Warehouse, MapPin, PackageOpen, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { mockAdminProducts } from "@/data/admin-products";
import DataTable, { Column } from "@/components/data-table/DataTable";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function WarehouseDetailPage(props: PageProps) {
  const params = use(props.params);

  const warehouses = [
    { id: "wh-1", name: "SF Logistics Center", location: "128 Innovation Way, San Francisco, CA", capacity: 85, totalStock: 8200 },
    { id: "wh-2", name: "NY East Hub", location: "542 Tech Blvd, New York, NY", capacity: 48, totalStock: 3100 },
    { id: "wh-3", name: "Chicago Midwest", location: "1007 Hub Ave, Chicago, IL", capacity: 32, totalStock: 1150 },
  ];

  const wh = warehouses.find((w) => w.id === params.id) || warehouses[0];

  const warehouseProducts = mockAdminProducts.filter(
    (p) => p.warehouse.toLowerCase().includes(wh.name.split(" ")[0].toLowerCase())
  );

  const columns: Column<any>[] = [
    {
      header: "Product",
      accessorKey: "name",
      cell: (row) => <span className="font-bold text-white text-xs">{row.name}</span>,
    },
    {
      header: "SKU Code",
      accessorKey: "sku",
      cell: (row) => <span className="font-mono text-xs">{row.sku}</span>,
    },
    {
      header: "Warehouse Stock",
      accessorKey: "stock",
      cell: (row) => <span className="font-bold text-xs">{row.stock} Units</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-left">
      <div className="flex justify-between items-center select-none">
        <Link href="/warehouses">
          <Button variant="outline" size="sm" className="rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs gap-1.5 cursor-pointer">
            <ArrowLeft size={14} />
            Back to Warehouses
          </Button>
        </Link>
      </div>

      <div className="bg-flownexa-surface border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="flex gap-4 items-center">
          <div className="size-16 rounded-2xl bg-flownexa-lime flex items-center justify-center text-flownexa-black text-2xl font-extrabold shadow-lg shadow-flownexa-lime/10 shrink-0">
            <Warehouse size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-heading">{wh.name}</h2>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <MapPin size={12} className="text-flownexa-lime" />
              {wh.location}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-flownexa-surface border-white/5 rounded-3xl text-left">
          <CardContent className="p-6 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Space Capacity</h3>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black text-white">{wh.capacity}%</span>
              <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-flownexa-lime h-full rounded-full" style={{ width: `${wh.capacity}%` }} />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Cubic volume utilization is reaching caution threshold. Schedule cargo transfers if space drops below 10%.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-flownexa-surface border-white/5 md:col-span-2 rounded-3xl text-left">
          <CardContent className="p-6 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-sm text-white border-b border-white/5 pb-2">Allocated Products</h3>
            <DataTable data={warehouseProducts} columns={columns} searchKey="name" searchPlaceholder="Search products in this warehouse..." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
