"use client";

import { OrderColumns } from "@/app/(dashboard)/[storeId]/(routes)/orders/components/columns";
import { Heading } from "@/components/heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { columns } from "./columns";

interface OrderClientProps {
  data: OrderColumns[];
  userId: string | null;
}

export const ShippingClient = ({ data, userId }: OrderClientProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Bill (${data.length})`}
          description="Order Bill for you"
        />
      </div>
      <Separator />

      <DataTable searchKey="phone" columns={columns as any} data={data} />
    </>
  );
};
