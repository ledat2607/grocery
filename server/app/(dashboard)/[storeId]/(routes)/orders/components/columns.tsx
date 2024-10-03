"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-action";
import { Product } from "@/type-db";
import CellImage from "../../billboards/components/cell-image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumns = {
  id: string;
  isPaid: boolean;
  phone: string;
  address: string;
  products: string;
  totalPrice: string;
  images: string[];
  order_status: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumns>[] = [
  {
    accessorKey: "id",
    header: "Order Id",
  },
  {
    accessorKey: "phone",
    header: "User phoneNumber",
  },
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => {
      const { images } = row.original;
      return <CellImage imageUrl={images[0]} />;
    },
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "order_status",
    header: "Status",
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
