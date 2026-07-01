"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/shared/EmptyState";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey: keyof T;
  // Card Grid view support
  renderCard?: (item: T) => React.ReactNode;
  bulkActions?: {
    label: string;
    action: (selectedItems: T[]) => void;
    icon?: any;
    variant?: "default" | "destructive" | "outline";
  }[];
}

export default function DataTable<T extends { id: string | number }>({
  data,
  columns,
  searchPlaceholder = "Search records...",
  searchKey,
  renderCard,
  bulkActions,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" | null }>({
    key: "",
    direction: null,
  });
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((c) => c.header))
  );

  // Sorting logic
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  // Filtered and Sorted Data
  const processedData = useMemo(() => {
    let result = [...data];

    // Search query filter
    if (searchQuery) {
      result = result.filter((item) => {
        const value = item[searchKey];
        if (value === undefined || value === null) return false;
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Sort order logic
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a: any, b: any) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (valA === undefined || valB === undefined) return 0;

        if (typeof valA === "number" && typeof valB === "number") {
          return sortConfig.direction === "asc" ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();

        if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
        if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, searchKey, sortConfig]);

  // Pagination totals
  const totalPages = Math.ceil(processedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  // Bulk actions row selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = paginatedData.map((item) => item.id);
      setSelectedIds(new Set([...selectedIds, ...allIds]));
    } else {
      const newSelected = new Set(selectedIds);
      paginatedData.forEach((item) => newSelected.delete(item.id));
      setSelectedIds(newSelected);
    }
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every((item) => selectedIds.has(item.id));
  const isSomeSelected = paginatedData.length > 0 && paginatedData.some((item) => selectedIds.has(item.id)) && !isAllSelected;

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    toast.success(`Exporting as ${format.toUpperCase()}`, {
      description: `Dispatched document with ${processedData.length} records.`,
    });
  };

  const activeBulkItems = useMemo(() => {
    return data.filter((item) => selectedIds.has(item.id));
  }, [data, selectedIds]);

  return (
    <div className="flex flex-col gap-4 font-sans select-none">
      
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-zinc-900/40 p-4 border border-white/5 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="pl-9 h-10 bg-[#1A1D26] border-white/5 placeholder-muted-foreground text-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
          {/* Column Visibility Selector (only shown in table view) */}
          {viewMode === "table" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 rounded-xl border-white/5 bg-[#1A1D26] hover:bg-[#242836] text-xs gap-1.5 cursor-pointer">
                  <Filter size={13} />
                  <span>Columns</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1A1D26] border border-white/5 text-white rounded-xl font-sans">
                <DropdownMenuLabel className="text-xs font-semibold px-2 py-1.5 text-muted-foreground">Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                {columns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.header}
                    checked={visibleColumns.has(col.header)}
                    onCheckedChange={(checked) => {
                      const newCols = new Set(visibleColumns);
                      if (checked) {
                        newCols.add(col.header);
                      } else {
                        // Keep at least one column visible
                        if (newCols.size > 1) {
                          newCols.delete(col.header);
                        }
                      }
                      setVisibleColumns(newCols);
                    }}
                    className="text-xs hover:bg-white/5 cursor-pointer"
                  >
                    {col.header}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 rounded-xl border-white/5 bg-[#1A1D26] hover:bg-[#242836] text-xs gap-1.5 cursor-pointer">
                <Download size={13} />
                <span>Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1A1D26] border border-white/5 text-white rounded-xl font-sans">
              <DropdownMenuItem onClick={() => handleExport("csv")} className="text-xs hover:bg-white/5 cursor-pointer">Export CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")} className="text-xs hover:bg-white/5 cursor-pointer">Export Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")} className="text-xs hover:bg-white/5 cursor-pointer">Export PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Table / Grid Mode Toggle */}
          {renderCard && (
            <div className="flex border border-white/5 rounded-xl bg-[#1A1D26] p-0.5">
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "table" ? "bg-flownexa-lime text-flownexa-black" : "text-muted-foreground hover:text-white"}`}
              >
                <List size={14} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "grid" ? "bg-flownexa-lime text-flownexa-black" : "text-muted-foreground hover:text-white"}`}
              >
                <LayoutGrid size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.size > 0 && bulkActions && (
        <div className="flex items-center justify-between bg-flownexa-lime-muted border border-flownexa-lime/20 p-3 rounded-2xl">
          <span className="text-xs font-semibold text-flownexa-lime">
            {selectedIds.size} row(s) selected
          </span>
          <div className="flex gap-2">
            {bulkActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <Button
                  key={idx}
                  size="sm"
                  variant={action.variant || "default"}
                  onClick={() => {
                    action.action(activeBulkItems);
                    setSelectedIds(new Set()); // Reset selections
                  }}
                  className={`h-8 rounded-lg font-semibold text-[10px] uppercase tracking-wider px-3.5 cursor-pointer ${
                    action.variant === "destructive"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-flownexa-lime hover:bg-flownexa-lime-hover text-flownexa-black"
                  }`}
                >
                  {ActionIcon && <ActionIcon size={12} className="mr-1.5" />}
                  {action.label}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds(new Set())}
              className="h-8 rounded-lg border-white/10 bg-white/5 text-white hover:bg-white/10 text-[10px] font-semibold uppercase tracking-wider px-3.5 cursor-pointer"
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Listing (Table vs Grid Cards) */}
      {processedData.length === 0 ? (
        <EmptyState
          title="No records discovered"
          description="We couldn't find any records matching your search queries or active filters. Try refining parameters."
        />
      ) : viewMode === "table" ? (
        <div className="border border-white/5 rounded-2xl overflow-hidden bg-flownexa-surface">
          <Table>
            <TableHeader className="bg-zinc-950/40 border-b border-white/5">
              <TableRow className="hover:bg-transparent">
                {bulkActions && (
                  <TableHead className="w-[50px] text-center">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      className="border-white/20 data-[state=checked]:bg-flownexa-lime data-[state=checked]:text-flownexa-black"
                    />
                  </TableHead>
                )}
                {columns
                  .filter((col) => visibleColumns.has(col.header))
                  .map((col) => (
                    <TableHead
                      key={col.header}
                      className={col.sortable ? "cursor-pointer hover:text-white transition-colors" : ""}
                      onClick={() => col.sortable && handleSort(col.accessorKey as string)}
                    >
                      <div className="flex items-center gap-1.5 py-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                          {col.header}
                        </span>
                        {col.sortable && sortConfig.key === col.accessorKey && (
                          sortConfig.direction === "asc" ? <ChevronUp size={12} className="text-flownexa-lime" /> : <ChevronDown size={12} className="text-flownexa-lime" />
                        )}
                      </div>
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  className={`hover:bg-white/3 border-b border-white/5 transition-colors ${selectedIds.has(row.id) ? "bg-white/3" : ""}`}
                >
                  {bulkActions && (
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selectedIds.has(row.id)}
                        onCheckedChange={(checked) => handleSelectRow(row.id, !!checked)}
                        className="border-white/20 data-[state=checked]:bg-flownexa-lime data-[state=checked]:text-flownexa-black"
                      />
                    </TableCell>
                  )}
                  {columns
                    .filter((col) => visibleColumns.has(col.header))
                    .map((col) => (
                      <TableCell key={col.header} className="text-xs py-3.5 font-medium text-white max-w-[200px] truncate">
                        {col.cell ? col.cell(row) : String(row[col.accessorKey as keyof T] || "")}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        /* Grid card list view */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedData.map((item) => (
            <div key={item.id} className="relative">
              {bulkActions && (
                <div className="absolute top-3 left-3 z-10">
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={(checked) => handleSelectRow(item.id, !!checked)}
                    className="border-white/20 data-[state=checked]:bg-flownexa-lime data-[state=checked]:text-flownexa-black"
                  />
                </div>
              )}
              {renderCard!(item)}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Footer */}
      {processedData.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-zinc-900/20 p-4 border border-white/5 rounded-2xl text-xs text-muted-foreground select-none">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#1A1D26] border border-white/5 rounded px-2 py-1 text-xs text-white focus:outline-none"
            >
              {[5, 10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size} items
                </option>
              ))}
            </select>
            <span>of {processedData.length} records</span>
          </div>

          <div className="flex items-center gap-4">
            <span>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex border border-white/5 rounded-xl bg-[#1A1D26] p-0.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-muted-foreground hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-muted-foreground hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
