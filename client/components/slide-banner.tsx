// app/components/SlideBanner.tsx
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Billboards } from "@/type-db";

interface SlideBannerProps {
  billboards: Billboards[];
}

const SlideBanner: React.FC<SlideBannerProps> = ({ billboards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === billboards.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [billboards.length]);

  return (
    <section className="relative w-full h-[400px] overflow-hidden rounded-2xl">
      {billboards.length > 0 && (
        <div className="w-full h-full">
          {billboards.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={item.imageUrl}
                alt={item.label}
                className="object-cover w-full h-full"
                fill
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold bg-black bg-opacity-40">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SlideBanner;
