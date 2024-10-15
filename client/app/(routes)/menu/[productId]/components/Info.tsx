'use client'

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { Products } from "@/type-db";
import { CookingPot, ShoppingCart, Soup } from "lucide-react";
import { useState } from "react";


interface InfoProps {
  product: Products;
}
const Info = ({ product }: InfoProps) => {
  const [qty, setQty] = useState(1);
  const cart = useCart();
  const handleQty = (num:number)=>{
    setQty(num);
  }
  const addToCart = (data:Products)=>{
    cart.addItem({ ...data, qty: qty });
  }
  console.log(product);
  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-800">{product.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-base text-left text-neutral-700">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic, at!
          Minima nisi architecto pariatur sunt, deserunt sed officia vero?
          Aspernatur maxime nihil veniam recusandae obcaecati ducimus velit
          voluptatum dolores tempore!
        </p>
      </div>
      <div className="w-full flex items-center justify-start gap-2 flex-wrap px-2 mt-8">
        {product.category && (
          <div className="rounded-md bg-emerald-500/30 px-3 py-2 text-base flex items-center gap-3">
            <Soup className="w-4 h-4" />
            {product.category}
          </div>
        )}
        {product.cuisine && (
          <div className="rounded-md bg-red-500/30 px-3 py-2 text-base flex items-center gap-3">
            <CookingPot className="w-4 h-4" />
            {product.cuisine}
          </div>
        )}{" "}
        {product.size && (
          <div className="rounded-md bg-blue-500/30 px-3 py-2 text-base flex items-center gap-3">
            <Soup className="w-4 h-4" />
            {product.size}
          </div>
        )}
      </div>
      <div className="w-full grid grid-cols-4 my-12">
        <div className="col-span-1 space-y-8">
          <p className="text-lg font-semibold text-neutral-700">Price</p>
          <p className="text-lg font-semibold text-neutral-700">Serves</p>
          <p className="text-lg font-semibold text-neutral-700">Stock</p>
        </div>
        <div className="col-span-3 space-y-8">
          <div className="flex items-center gap-8">
            <p className="text-xl font-bold text-black">
              $ {product.discountPrice}
            </p>
            <p className="text-xl font-bold text-red-500 line-through">
              $ {product.price}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {" "}
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                onClick={() => handleQty(num)}
                key={num}
                className={cn(
                  "w-8 h-8 cursor-pointer rounded-full flex items-center justify-center border-2 border-green-500",
                  qty === num
                    ? "bg-green-500 shadow-md text-white"
                    : "bg-transparent shadow-none"
                )}
              >
                {num}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <p>{product.qty}</p>
            <p className="text-green-500 font-bold underline">Sold: {product.sold_out}</p>
          </div>
        </div>
      </div>
      <Button
        onClick={() => addToCart(product)}
        className="w-full py-6 text-xl font-semibold hover:bg-green-700 hover:text-white flex items-center justify-center gap-3"
      >
        <ShoppingCart className="w-6 h-6 mr-4" />
        Add to cart
      </Button>
    </div>
  );
};
 
export default Info;