"use client";

import { cn } from "@/lib/utils";
import Container from "./container";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import MainNav from "./main-nav";
import { useEffect, useState } from "react";
import CartActionButon from "./cart-action";
import { SearchIcon } from "lucide-react";
import { Products } from "@/type-db";
import { fetchProducts } from "@/actions/fetchProducts";
import { Separator } from "./ui/separator";
import Modal from "./modal";
import Image from "next/image";

interface HeaderProps {
  userId: string | null;
}

const Header = ({ userId }: HeaderProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const [productData, setProductData] = useState<Products[] | null>(null); // Initialize productData
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Products[]>([]);

  useEffect(() => {
    // Fetch products on mount
    const getProductData = async () => {
      const data = await fetchProducts();
      setProductData(data);
    };
    getProductData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filteredResults =
        productData?.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, productData]);

  const handleSearchClick = () => setSearchModalOpen(true);
  const closeSearchModal = () => setSearchModalOpen(false);

  
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
          <SearchIcon
            onClick={handleSearchClick}
            className={`ml-4 ${
              scrolled ? "text-black" : "text-white"
            } cursor-pointer`}
          />

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
      <Modal
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        title="Search products"
      >
        <input
          type="text"
          placeholder="Enter search terms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="w-full flex flex-col mt-4">
          {searchResults.length > 0 ? (
            searchResults.map((product) => (
              <div key={product.id} className="p-2 border-b">
                <div className="w-full flex items-center justify-between">
                  <Link
                    href={`/menu/${product.id}`}
                    onClick={()=>{
                      closeSearchModal(), setSearchQuery("");
                    }}
                    className="text-lg font-semibold"
                  >
                    {product.name}
                  </Link>
                  <Image
                    src={product.images[0].url}
                    alt=""
                    width={60}
                    height={60}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No products found</p>
          )}
        </div>
        <Separator />
      </Modal>
    </header>
  );
};

export default Header;
