
"use client";
import { useParams, useRouter } from "next/navigation";
import { ProductColumns } from "./columns";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, MoreVertical, Pen, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "@/lib/firebase";
import axios from "axios";
import { AlertModal } from "@/components/modal/alert-modal";

interface CellActionProps {
  data: ProductColumns;
}

export const CellAction = ({ data }: CellActionProps) => {
    const router = useRouter();
    const params = useParams();

    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (id:string)=>{
        navigator.clipboard.writeText(id);
        toast.success("Copied");
    }
    const onDelete = async () => {
      try {
        setIsLoading(true);
        await axios.delete(`/api/stores/${params.storeId}/products/${data.id}`);
        toast.success("Success!");
      } catch (error) {
        console.log(error);
      } finally {
        router.refresh();
        setIsLoading(false);
      }
    };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isLoading}
      />
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
            onClick={() => onCopy(data.id)}
            className="cursor-pointer text-green-500"
          >
            <Copy className="w-4 h-4 mr-4 text-green-500" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/products/${data.id}`)
            }
            className="cursor-pointer text-yellow-500"
          >
            <Pen className="w-4 h-4 text-yellow-500 mr-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="cursor-pointer text-red-500"
          >
            <Trash className="w-4 h-4 mr-4 text-red-500" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
