"use client";

import { cn } from "@/lib/utils";
import Container from "./container";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import MainNav from "./main-nav";
import { useEffect, useState } from "react";
import CartActionButon from "./cart-action";

interface HeaderProps {
  userId: string | null;
}

const Header = ({ userId }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () =>{
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    }
    window.addEventListener("scroll", handleScroll);

    return () => window.addEventListener("scroll", handleScroll);
  
    
  }, [])
  
  return (
    <header
      className={cn(
        "w-full z-50 transition",
        scrolled ? "fixed top-0 left-0 bg-white shadow-xl" : "bg-transparent"
      )}
    >
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-12 flex h-16 items-center">
          <Link
            href={"/"}
            className="uppercase font-bold text-md lg:text-xl gap-x-2 flex"
          >
            Grocery <span className="text-green-700">Store.</span>
          </Link>

          <MainNav scolled={scrolled} />

          {userId ? (
            <div className="ml-4 space-x-4">
              <UserButton afterSwitchSessionUrl="/" />
            </div>
          ) : (
            <div className="flex items-center space-x-2 ml-4">
              <Link href={"/sign-in"}>
                <Button>Sign in</Button>
              </Link>
            </div>
          )}
          {userId && <CartActionButon />}
        </div>
      </Container>
    </header>
  );
};

export default Header;
