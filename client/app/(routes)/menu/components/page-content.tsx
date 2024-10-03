"use client";

import Box from "@/components/box";
import Popularcontent from "@/components/popular-content";
import { Products } from "@/type-db";
import { ChevronRight, Home, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface PageContentProps {
  product: Products[];
}

const PageContent = ({ product }: PageContentProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentParams = Object.fromEntries(searchParams.entries());

  const handleClick = (param: string) => {
    if (currentParams.hasOwnProperty(param)) {
      const newParams = { ...currentParams };
      delete newParams[param];
      const href = qs.stringifyUrl({
        url: "/menu",
        query: newParams,
      });
      router.push(href);
    }
  };
  return (
    <>
      <Box className="pt-4 pl-16 pb-12 flex flex-col">
        <Box className="text-neutral-700 text-sm items-center">
          <Link href={"/"} className="flex items-center gap-2">
            <Home className="w-6 h-6 cursor-pointer" />
            Main page
          </Link>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
          <Link href={"/menu"} className="flex items-center gap-2">
            Menu
          </Link>
          {searchParams.get("category") && (
            <>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
              <Link href={"/menu"} className="flex items-center gap-2">
                {searchParams.get("category")}
              </Link>
            </>
          )}
        </Box>
        <Box className="mt-8 flex flex-col items-start">
          {searchParams.get("category") && (
            <h1>{searchParams.get("category")}</h1>
          )}
          <Box className="gap-3 my-4">
            {currentParams &&
              Object.entries(currentParams).map(([key, value]) => (
                <div className="px-4 py-1 cursor-pointer hover:shadow-md rounded-lg bg-emerald-500/10 text-neutral-600 flex items-center gap-1">
                  {value}
                  <X
                    onClick={() => handleClick(key)}
                    className="w-4 h-4 cursor-pointer hover:text-red-500"
                  />
                </div>
              ))}
          </Box>
        </Box>
      </Box>
      <div className="grid grid-cols-2 lg:grid-cols-4 w-full h-full gap-4 pl-16">
        {product.length > 0 ? (
          <>
            {product.map((item) => (
              <Popularcontent data={item} />
            ))}
          </>
        ) : (
          <div className="flex items-center justify-center">
            No products found
          </div>
        )}
      </div>
    </>
  );
};

export default PageContent;
