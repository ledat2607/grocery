"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Product } from "@/type-db";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import Modal from "@/components/modal"; // Ensure the modal import is correct
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CellImage from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/cell-image";
import { CellAction } from "./cell-actions";

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
    cell: ({ row }) => (
      <Button onClick={() => handleRowClick(row.original)}>
        {row.original.id}
      </Button>
    ),
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
      const [selectedStatus, setSelectedStatus] = useState(row.original.order_status);
      const params = useParams();
      const router = useRouter();

      const handleUpdateStatus = async () => {
        try {
          const response = await fetch(`/api/stores/GsGFvwku3vPwlUyXKUnn/orders/${row.original.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_status: selectedStatus,
              product: row.original,
            }),
          });

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
            disabled={row.original.order_status === "Deliveried" || row.original.idShipper === undefined}
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
            <Select defaultValue={selectedStatus} onValueChange={setSelectedStatus}>
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

// Main component
const YourComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ShippingColumns | null>(null);

  // Function to handle row click
  const handleRowClick = (order: ShippingColumns) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Render your table with columns here */}
      {/* Assuming you have a Table component that takes columns as a prop */}
      {/* <Table columns={columns} data={yourData} /> */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {selectedOrder && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>User Phone:</strong> {selectedOrder.phone}</p>
            <p><strong>Address:</strong> {selectedOrder.address}</p>
            <p><strong>Status:</strong> {selectedOrder.order_status}</p>
            <p><strong>Total Price:</strong> {selectedOrder.totalPrice}</p>
            <h3 className="font-semibold mt-4">Products:</h3>
            <ul>
              {selectedOrder.productQuantities.map((item) => (
                <li key={item.productId}>
                  Product ID: {item.productId} (Quantity: {item.qty})
                </li>
              ))}
            </ul>
            <p><strong>Created At:</strong> {selectedOrder.createdAt}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default YourComponent;
