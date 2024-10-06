"use client";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { Eraser } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import CartItem from "./cart-item";
import Box from "@/components/box";
import { Separator } from "@/components/ui/separator";
import axios from "axios";


interface CartContentProps {
  userId: string | null;
}

const CartContent = ({ userId }: CartContentProps) => {
  const cart = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();

  const totalPrice = cart.items.reduce((total, item) => {
    return total + Number(item.discountPrice * item.qty);
  }, 0);

  const exchangeRate = 24000; // Example exchange rate: 1 USD = 24,000 VND
  const totalPriceInVND = totalPrice * exchangeRate;

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment completed");
      cart.removeAll();
    }
    if (searchParams.get("canceled")) {
      toast.error("Something went wrong");
    }
  }, [searchParams, cart.removeAll]);


  const handleCheckOut =async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
      {
        products: cart.items,
        userId,
      }
    );
    window.location = res.data.url;
  };
  return (
    <>
      <div className="w-full flex items-center justify-between gap-4">
        <h2 className="text-3xl font-semibold text-neutral-700">Cart Items</h2>
        <Button onClick={cart.removeAll} variant={"destructive"}>
          <h2 className="flex items-center gap-4 text-md font-semibold">
            Clear <Eraser className="w-5 h-5 cursor-pointer animate-bounce" />
          </h2>
        </Button>
      </div>
      <div className="w-full flex lg:gap-x-8">
        <div className="w-[90%] mx-auto lg:mx-0 lg:w-[60%]">
          {cart.items.length === 0 && (
            <div className="w-full flex items-center justify-center">
              <p className="text-2xl text-neutral-700 font-semibold">
                No item in your cart
              </p>
            </div>
          )}
          <div className="w-full space-y-4">
            {cart.items.map((item) => (
              <CartItem item={item} />
            ))}
          </div>
        </div>
        <div className="w-[90%] lg:w-[40%] space-y-8">
          <Box className="flex flex-col justify-start gap-2 shadow-lg rounded-lg p-3 space-y-2 bg-slate-100">
            <h2 className="text-lg text-neutral-700 font-semibold">
              Order summary
            </h2>
            <Separator />

            <Box className="flex flex-col space-y-2">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center justify-between w-full px-4 shadow-sm whitespace-nowrap text-muted-foreground">
                  <p className="text-black font-bold text-base">Total</p>
                  <p className="font-semibold text-2xl text-muted-foreground">
                    $ {totalPrice.toFixed(2)}
                  </p>
                </div>
                =
                <p className="font-semibold text-2xl ml-2 text-muted-foreground">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPriceInVND)}
                </p>
              </div>
            </Box>
          </Box>
          <Box className="flex-col items-start justify-start gap-2 shadow-md rounded-lg p-3 space-y-2 bg-slate-50">
            <h2 className="text-lg text-neutral-700 font-semibold">Payment</h2>
            <Separator />
            <Button onClick={() => handleCheckOut()} className="w-full">
              Check out
            </Button>
          </Box>
        </div>
      </div>
    </>
  );
};

export default CartContent;
