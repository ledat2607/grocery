"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-action";
import CellImage from "../../billboards/components/cell-image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumns = {
  id: string;
  name: string;
  price: string;
  discountPrice: string;
  qty: number;
  images: { url: string }[];
  isFeatured: boolean;
  isArchived: boolean;
  size: string;
  cuisine: string;
  category: string;
  createdAt: string;
};

export const columns: ColumnDef<ProductColumns>[] = [
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const { images } = row.original;
      return <CellImage imageUrl={images[0].url} />;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "discountPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Discount Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "qty",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const qty = row.original.qty;
      return (
        <span
          className={
            qty < 20 ? "text-red-500 cursor-pointer" : "cursor-not-allowed"
          }
        >
          {qty}
        </span>
      );
    },
  },

  {
    accessorKey: "isFeatured",
    header: "Feature",
  },
  {
    accessorKey: "isArchived",
    header: "Archive",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Weight / Unit",
  },
  {
    accessorKey: "cuisine",
    header: "From",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date create
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  { id: "actions", cell: ({ row }) => <CellAction data={row.original} /> },
];
