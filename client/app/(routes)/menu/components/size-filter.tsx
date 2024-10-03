'use client'

import Box from "@/components/box";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Category, Size } from "@/type-db";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string"


interface SizeFilterProps {
  sizes: Size[];
}

const SizeFilter = ({ sizes }: SizeFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClick = (size: string) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    if (currentParams.size === size) {
      delete currentParams.size;
    } else {
      currentParams.size = size;
    }
    const href = qs.stringifyUrl({
      url: "/menu",
      query: currentParams,
    });
    router.push(href);
  };
  return (
    <Box className="flex flex-col gap-2 border-b pb-4 rounded-2xl bg-gray-200 border-blue-500 p-2 cursor-pointer">
      <h2 className="text-xl font-semibold text-neutral-700">Size</h2>
      <Separator className="bg-red-500" />
      <Box className="flex flex-col gap-2 mt-2">
        {sizes?.map((size) => (
          <div
            onClick={() => handleClick(size.name)}
            key={size.id}
            className={cn(
              "text-sm font-semibold text-neutral-700 flex items-center gap-2"
            )}
          >
            <p>
              {size.name} - ({size.value})
            </p>
            {size.name === searchParams.get("size") && (
              <Check className="w-4 h-4 text-green-500" />
            )}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default SizeFilter;