'use client'

import Box from "@/components/box";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Category, Cuisine, Size } from "@/type-db";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string"


interface CuisinFilterProps {
  cuisines: Cuisine[];
}

const CuisinFilter = ({ cuisines }: CuisinFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClick = (cuisine: string) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    if (currentParams.cuisine === cuisine) {
      delete currentParams.cuisine;
    } else {
      currentParams.cuisine = cuisine;
    }
    const href = qs.stringifyUrl({
      url: "/menu",
      query: currentParams,
    });
    router.push(href);
  };
  return (
    <Box className="flex flex-col gap-2 border-b pb-4 rounded-2xl bg-gray-200 border-blue-500 p-2 cursor-pointer">
      <h2 className="text-xl font-semibold text-neutral-700">From</h2>
      <Separator className="bg-red-500" />
      <Box className="flex flex-col gap-2 mt-2">
        {cuisines?.map((cuisine) => (
          <div
            onClick={() => handleClick(cuisine.name)}
            key={cuisine.id}
            className={cn(
              "text-sm font-semibold text-neutral-700 flex items-center gap-2"
            )}
          >
            <p>{cuisine.name}</p>
            {cuisine.name === searchParams.get("cuisine") && (
              <Check className="w-4 h-4 text-green-500" />
            )}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default CuisinFilter;