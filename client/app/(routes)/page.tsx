"use client";
import { useEffect, useState } from "react";
import Container from "@/components/container";
import Popularcontent from "@/components/popular-content";
import SlideBanner from "@/components/slide-banner";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase";
import { Billboards, Products } from "@/type-db"; // Adjust the imports based on your structure
import { collection, doc, getDocs } from "firebase/firestore";
import { FileHeart, Salad, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HomePage = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [billboards, setBillboards] = useState<Billboards[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productSnapshot = await getDocs(
          collection(doc(db, "stores", "Dig8zntOmcTZ2jURnCr5"), "products")
        );
        const productData = productSnapshot.docs.map((doc) =>
          doc.data()
        ) as Products[];
        setProducts(productData.filter((pro) => pro.isFeatured === true));

        const billboardSnapshot = await getDocs(
          collection(doc(db, "stores", "Dig8zntOmcTZ2jURnCr5"), "billboards")
        );
        const billboardData = billboardSnapshot.docs.map((doc) =>
          doc.data()
        ) as Billboards[];
        setBillboards(billboardData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Handlers for pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <Container className="px-4 lg:px-12">
      <section className="grid grid-cols-1 md:grid-cols-2 py-2 pt-16">
        <div className="flex flex-col items-start justify-start gap-4">
          <p className="px-6 py-1 rounded-full border-2 border-gray-500">
            Buy fresh
          </p>
          <h2 className="text-5xl font-bold tracking-wider uppercase text-neutral-700 my-4">
            Just come <span className="block py-4">Grocery Store</span>
          </h2>
          <p className="text-base text-center md:text-left text-neutral-500 my-4">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Consequuntur quo quos incidunt dolor. Dicta ipsa saepe autem
            temporibus optio aspernatur asperiores. Doloremque natus odit
            quidem! Dolores, porro quibusdam. Ipsum, sunt?
          </p>
          <div className="my-4 flex items-center justify-center gap-6 w-full md:w-auto">
            <img
              src="/nature-leaf-logo-design-inspiration_586862-351.png"
              className="absolute -z-50 top-0 left-10 w-full md:w-[20%]"
            />
            <Link href={"/menu"}>
              <Button className="px-8 md:px-15 py-4 md:py-6 rounded-full bg-green-500">
                Order now
              </Button>
            </Link>
            <Link href={"/menu"}>
              <Button
                variant={"outline"}
                className="px-8 md:px-15 py-4 md:py-6 rounded-full"
              >
                Explore now
              </Button>
            </Link>
          </div>
        </div>
        <div>
          <div className="w-full relative h-[560px] flex items-center justify-center">
            <Image
              src={"/vet.png"}
              alt=""
              className="object-contain w-full h-full absolute"
              fill
            />
          </div>
        </div>
      </section>
      <section className="mt-24 mb-8">
        <SlideBanner billboards={billboards} />
      </section>
      {/*All products */}
      <h2 className="font-bold text-3xl capitalize">All products</h2>
      <Separator className="mt-2" />
      <section className="grid grid-cols-2 md:grid-cols-5 gap-6 gap-y-10 md:gap-12 my-4 py-8 mt-16">
        {currentProducts.map((item) => (
          <Popularcontent key={item.id} data={item} />
        ))}
      </section>

      {/* Pagination Controls */}
      <div className="flex justify-between my-4">
        <Button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>
      {/* Why choose us */}
      <section className="my-4 py-12 flex flex-col items-center justify-center">
        <h2 className="text-5xl md:text-5xl font-bold tracking-wider uppercase text-neutral-700 my-4">
          Why choose us?
        </h2>
        <p className="w-full text-center md:w-[560px] text-base text-neutral-500 my-2">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic, commodi
          repellendus quod tempore reiciendis mollitia perferendis{" "}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full my-6 mt-20">
          <Card className="shadow-lg rounded-md border-none p-4 py-12 flex flex-col items-center justify-center gap-4">
            <Salad className="w-8 h-8 text-hero" />
            <CardTitle className="text-neutral-600">
              Serve Healthy Food
            </CardTitle>
            <CardDescription className="text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              laudantium sunt
            </CardDescription>
          </Card>
          <Card className="shadow-lg rounded-md border-none p-4 py-12 flex flex-col items-center justify-center gap-4">
            <FileHeart className="w-8 h-8 text-hero" />
            <CardTitle className="text-neutral-600">Best Quality</CardTitle>
            <CardDescription className="text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              laudantium sunt
            </CardDescription>
          </Card>
          <Card className="shadow-lg rounded-md border-none p-4 py-12 flex flex-col items-center justify-center gap-4">
            <Truck className="w-8 h-8 text-hero" />
            <CardTitle className="text-neutral-600">Fast Delivery</CardTitle>
            <CardDescription className="text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
              laudantium sunt
            </CardDescription>
          </Card>
        </div>
      </section>
      {/* Chef */}
      <section className="my-4 py-12 flex flex-col items-center justify-center">
        <h2 className="text-5xl md:text-5xl font-bold tracking-wider uppercase text-neutral-700 my-4">
          Our Special Products
        </h2>
        <p className="w-full text-center md:w-[560px] text-base text-neutral-500 my-2">
          Discover the best quality products from our store, carefully selected
          just for you.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full my-6 mt-20">
          {/* Product Card 1 */}
          <Card className="shadow-lg relative rounded-2xl border-none flex flex-col items-center justify-end h-96 md:h-[520px] bg-white">
            <Image
              src="/fresh.png" // Replace with a grocery product image
              alt="Fresh Vegetables"
              className="w-full h-full object-cover rounded-2xl"
              fill
            />
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-gray-900 to-transparent text-white text-center">
              <h3 className="text-xl font-semibold">Fresh Vegetables</h3>
              <p className="text-sm">
                Healthy and organic produce sourced locally.
              </p>
            </div>
          </Card>

          {/* Product Card 2 */}
          <Card className="shadow-lg rounded-2xl relative border-none flex flex-col items-center justify-end h-96 md:h-[520px] mt-20 bg-white">
            <Image
              src="/fruits.png" // Replace with another grocery product image
              alt=""
              className="w-full h-full object-cover rounded-2xl"
              fill
            />
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-gray-900 to-transparent text-white text-center">
              <h3 className="text-xl font-semibold">Artisan Bread</h3>
              <p className="text-sm">Fresh fruit for you</p>
            </div>
          </Card>

          {/* Product Card 3 */}
          <Card className="shadow-lg relative rounded-2xl border-none flex flex-col items-center justify-end h-96 md:h-[520px] bg-white">
            <Image
              src="/dairy.jpg" // Replace with another grocery product image
              alt="Dairy Products"
              className="w-full h-full object-cover rounded-2xl"
              fill
            />
            <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-gray-900 to-transparent text-white text-center">
              <h3 className="text-xl font-semibold">Dairy Products</h3>
              <p className="text-sm">
                High-quality dairy for a nutritious diet.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </Container>
  );
};

export default HomePage;
