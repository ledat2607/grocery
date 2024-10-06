"use client";

import { Products } from "@/type-db";
import { Card, CardDescription, CardTitle } from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Heart, HeartCrack, ShoppingCart } from "lucide-react";
import { useState } from "react";
import useCart from "@/hooks/use-cart";

interface PopularcontentProps {
  data: Products;
}
    
const Popularcontent = ({ data }: PopularcontentProps) => {
  const cart = useCart();
    const [isLiked, setIsLiked] = useState(false);
    const addToCart = (data: Products) => {
      cart.addItem({ ...data, qty: 1 });
    };
  return (
    <Card className="w-full min-h-[340px] bg-white shadow-lg border-gradient flex flex-col items-center justify-center relative py-6 pt-24 mb-24 lg:pt-28">
      <div className="absolute bg-green-500 -top-[4%] md:-top-[20%] overflow-hidden w-24 md:w-40 h-24 md:h-40 rounded-full flex items-center justify-center p-1 md:p-2">
        <div className="w-full h-full rounded-full relative bg-white">
          <Image
            className="w-full h-full rounded-full p-1 relative object-contain bg-white"
            fill
            alt=""
            src={data.images[0].url}
          />
        </div>
      </div>
      <Link href={`/menu/${data.id}`} className="w-full px-2 mt-4 text-center">
        <CardTitle className="text-neutral-700 truncate w-full">
          {data.name}
        </CardTitle>
      </Link>
      <div className="w-full grid grid-cols-3 gap-2 px-2 mt-4">
        <p className="rounded-md text-center whitespace-nowrap text-white bg-emerald-500 px-2 py-[2px] text-sm font-bold">
          {data.cuisine}
        </p>
        <p className="rounded-md text-center whitespace-nowrap text-white bg-rose-500 px-2 py-[2px] text-sm font-bold">
          {data.category}
        </p>
        <p className="rounded-md text-center whitespace-nowrap text-white bg-rose-500 px-2 py-[2px] text-sm font-bold">
          {data.size}
        </p>
      </div>
      <CardDescription className="text-center px-2 py-2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad natus
        molestias nulla quas dolorum sunt assumenda totam quod cum inventore.
      </CardDescription>
      <div className="w-full flex items-center px-2 mt-4 gap-3">
        <Button
          className="rounded-full font-semibold text-lg text-muted-foreground"
          variant={"outline"}
        >
          $ {data.discountPrice}
        </Button>
        <Link href={`/menu/${data.id}`} className="w-full">
          <Button className="rounded-full font-semibold w-full text-lg text-white bg-green-400">
            Order
          </Button>
        </Link>
      </div>

      {/*Card */}
      <Button
        onClick={() => addToCart(data)}
        className="absolute top-7 right-0 rounded-tr-none rounded-tl-lg rounded-bl-lg rounded-br-none px-3"
      >
        <ShoppingCart className="w-4 h-4" />
      </Button>

      {/*Wishlist */}
      <Button
        variant={isLiked ? "default" : "outline"}
        className="absolute top-7 left-0 rounded-tl-none rounded-tr-lg rounded-br-lg rounded-bl-none px-3"
      >
        {isLiked ? (
          <Heart className="w-4 h-4" />
        ) : (
          <HeartCrack className="w-4 h-4" />
        )}
      </Button>
    </Card>
  );
};

export default Popularcontent;
