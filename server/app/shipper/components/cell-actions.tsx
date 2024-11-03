"use client";
import { useRouter } from "next/navigation";
import { ShippingColumns } from "./columns";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import axios from "axios";
import { UserRoles } from "@/const"; // Import UserRoles

interface CellActionProps {
  data: ShippingColumns;
}

export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const onBookDelivery = async () => {
    try {
      setIsLoading(true);
      const shipperId = UserRoles[1]?.id; // Adjust index as needed

      // Update the order with the shipperId and additional data
      await axios.patch(`/api/stores/Dig8zntOmcTZ2jURnCr5/shipper`, {
        shipperId,
        orderId: data.id,
        ...data,
      });

      toast.success("Delivery booked successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to book delivery.");
    } finally {
      router.refresh();
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="h-8 w-8 p-0">
            <span className="sr-only">Open</span>
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Separator />
          <DropdownMenuItem
            className="cursor-pointer text-green-500"
            onClick={onBookDelivery}
            disabled={isLoading} // Disable button while loading
          >
            <Edit className="w-4 h-4 mr-4 text-green-500" />
            {isLoading ? "Booking..." : "Book Delivery"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-blue-500"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          >
            <Eye className="w-4 h-4 mr-4 text-blue-500" />
            View Bill
          </DropdownMenuItem>
          <Separator />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Render the Modal */}
    </>
  );
};
