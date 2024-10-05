'use client'

import Popularcontent from "@/components/popular-content";
import { Products } from "@/type-db";
import { useParams } from "next/navigation";

interface SuggestedListProps {
  products: Products[];
}

const SuggestedList = ({ products }: SuggestedListProps) => {
    const { productId } = useParams();

  return (
    <>
      <h2 className="text-3xl text-neutral-700 font-semibold">
        Related Products
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 gap-y-20 md:gap-y-24 my-6 md:py-12">
        {products
          .filter((item) => item.id !== productId)
          .map((product) => (
            <Popularcontent data={product} />
          ))}
      </div>
    </>
  );
};
 
export default SuggestedList;