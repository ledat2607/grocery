"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns, OrderColumns } from "./columns";

interface OrderClientProps {
  data: OrderColumns[];
}

export const OrderClient = ({ data }: OrderClientProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders (${data.length})`}
          description="Orders for your store"
        />
      </div>
      <Separator />

      <DataTable searchKey="phone" columns={columns} data={data} />
    </>
  );
};
