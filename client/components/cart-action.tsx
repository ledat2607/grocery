"use client";

import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";


const CartActionButon = () => {
  const [mounted, setMounted] = useState(false);
  const cart = useCart();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);
  if(!mounted){
    return null;
  }
  return (
    <div className="ml-4 flex items-center justify-center gap-x-4">
      <Button
        className="rounded-full gap-4"
        onClick={() => router.push("/cart")}
      >
        <ShoppingBag className="w-5 h-5 cursor-pointer text-white animate-pulse" />
        <span className="text-sm font-medium">{cart.items.length}</span>
      </Button>
    </div>
  );
}
 
export default CartActionButon;