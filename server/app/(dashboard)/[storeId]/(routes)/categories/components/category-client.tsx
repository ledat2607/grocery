"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";
import { Billboards } from "@/type-db";
import { PlusCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumns, columns } from "./columns";

interface CategoryClientProps {
  data: CategoryColumns[];
}

export const CategoryClient = ({ data }: CategoryClientProps) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/create`)}
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
