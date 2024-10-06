"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { CellAction } from "./cell-action";
import { Product } from "@/type-db";
import CellImage from "../../billboards/components/cell-image";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Đảm bảo đường dẫn đúng đến component Select
import { Modal } from "@/components/modal";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

// This type is used to define the shape of our data.
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
    accessorKey: "address",
    header: "Address",
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
    cell: ({ row }) => {
      const [isOpen, setIsOpen] = useState(false);
      const [selectedStatus, setSelectedStatus] = useState(
        row.original.order_status
      );
      const params = useParams();
      const router = useRouter();

      const handleUpdateStatus = async () => {
        try {
          const response = await fetch(
            `/api/stores/${params.storeId}/orders/${row.original.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ order_status: selectedStatus }),
            }
          );

          if (!response.ok) {
            const errorMessage = await response.text();
            console.error("Error updating status:", errorMessage);
            return;
          }

          const updatedOrder = await response.json();
          setIsOpen(false); 
          toast.success("Updated");
          router.refresh();
        } catch (error) {
          console.error("Error in handleUpdateStatus:", error);
        }
      };

      return (
        <>
          <Button
            disabled={row.original.order_status === "Deliveried"}
            onClick={() => setIsOpen(true)}
          >
            {row.original.order_status}
          </Button>
          <Modal
            title="Update Order Status"
            desription="Select a new status for the order"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <Select
              defaultValue={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Delivering">On delivery</SelectItem>
                <SelectItem value="Deliveried">Deliveried</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus}>Submit</Button>
            </div>
          </Modal>
        </>
      );
    },
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
