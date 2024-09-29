"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Billboards } from "@/type-db";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumns, columns } from "./columns";

interface BillboardClientProps {
  data: BillboardColumns[];
}

export const BillboardClient = ({ data }: BillboardClientProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Billboards" description="Billboard for your store" />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/create`)}
        >
          <PlusCircle className="w-5 h-5 cursor-pointer mr-4 animate-bounce" />
          Add new
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} />
    </>
  );
};
