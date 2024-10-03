'use client'

import Box from "@/components/box";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Category } from "@/type-db";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string"


interface CategoryFilterProps {
  categories: Category[];
}

const CategoryFilter = ({ categories }: CategoryFilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClick = (category: string) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    if(currentParams.category === category){
        delete currentParams.category;
    }else{
        currentParams.category = category;
    }
    const href = qs.stringifyUrl({
      url: "/menu",
      query: currentParams,
    });
    router.push(href);
  };
  return (
    <Box className="flex flex-col gap-2 border-b pb-4 rounded-2xl bg-gray-200 border-blue-500 p-2 cursor-pointer">
      <h2 className="text-xl font-semibold text-neutral-700">Category</h2>
      <Separator className="bg-red-500" />
      <Box className="flex flex-col gap-2 mt-2">
        {categories?.map((category) => (
          <div
            onClick={() => handleClick(category.name)}
            key={category.id}
            className={cn(
              "text-sm font-semibold text-neutral-700 flex items-center gap-2"
            )}
          >
            <p>{category.name}</p>
            {category.name === searchParams.get("category") && (
              <Check className="w-4 h-4 text-green-500" />
            )}
          </div>
        ))}
      </Box>
    </Box>
  );
};
 
export default CategoryFilter;