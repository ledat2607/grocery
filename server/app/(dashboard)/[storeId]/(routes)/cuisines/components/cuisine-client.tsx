"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { columns, CuisineColumns } from "./columns";

interface CuisineClientProps {
  data: CuisineColumns[];
}

export const CuisineClient = ({ data }: CuisineClientProps) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Cuisines (${data.length})`}
          description="Cuisines for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/cuisines/create`)}
        >
          <PlusCircle className="w-5 h-5 cursor-pointer mr-4 animate-bounce" />
          Add new
        </Button>
      </div>
      <Separator />

      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
