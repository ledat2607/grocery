// columns.ts
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CellImage from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/cell-image";
import { CellAction } from "./cell-actions";
import Modal from "./modal";

// Define the shape of your data
export type ShippingColumns = {
  id: string;
  isPaid: boolean;
  phone: string;
  address: string;
  products: string;
  totalPrice: string;
  images: string[];
  order_status: string;
  createdAt: string;
  idShipper: string;
  productQuantities: { productId: string; qty: number }[]; // Includes product info and quantities
};

export const columns: ColumnDef<ShippingColumns>[] = [
  {
    accessorKey: "id",
    header: "Order Id",
    cell: ({ row }) => <Button>{row.original.id}</Button>,
  },
  {
    accessorKey: "phone",
    header: "User Phone Number",
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
          Total Price
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
      const router = useRouter();

      const handleUpdateStatus = async () => {
        try {
          const response = await fetch(
            `/api/stores/Dig8zntOmcTZ2jURnCr5/orders/${row.original.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                order_status: selectedStatus,
                product: row.original,
              }),
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
            disabled={
              row.original.order_status === "Deliveried" ||
              row.original.idShipper === undefined
            }
            onClick={() => setIsOpen(true)}
          >
            {row.original.order_status}
          </Button>
          <Modal
            title="Update Order Status"
            description="Select a new status for the order"
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
                <SelectItem value="Delivering">On Delivery</SelectItem>
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
          Date Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  { id: "actions", cell: ({ row }) => <CellAction data={row.original} /> },
];
