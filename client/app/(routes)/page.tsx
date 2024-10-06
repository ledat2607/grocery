import getProducts from "@/actions/get-products";
import Container from "@/components/container";
import Popularcontent from "@/components/popular-content";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { Products } from "@/type-db";
import { UserButton } from "@clerk/nextjs";
import { collection, doc, getDocs } from "firebase/firestore";
import { FileHeart, Salad, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HomePage = async () => {
  const productData = (
    await getDocs(
      collection(doc(db, "stores", "GsGFvwku3vPwlUyXKUnn"), "products")
    )
  ).docs.map((doc) => doc.data()) as Products[];

  const products = productData.filter((pro) => pro.isFeatured === true);
  console.log(productData);
  return (
    <>
      <Container className="px-4 lg:px-12">
        <section className="grid grid-cols-1 md:grid-cols-2 py-2 pt-16">
          <div className="flex flex-col items-start justify-start gap-4">
            <p className="px-6 py-1 rounded-full border-2 border-gray-500">
              Buy fresh{" "}
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
        {/*popular section */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-6 gap-y-10 md:gap-12 my-4 py-8">
          {products.map((item) => (
            <Popularcontent key={item.id} data={item} />
          ))}
        </section>
        {/**Why choose us */}
        <section className=" my-4 py-12 flex flex-col items-center justify-center">
          <h2 className="text-5xl md:text-5xl font-bold tracking-wider uppercase text-neutral-700 my-4">
            Why choose us ?
          </h2>
          <p className="w-full text-center md:w-[560px] text-base text-neutral-500 my-2">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic,
            commodi repellendus quod tempore reiciendis mollitia perferendis{" "}
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
        {/**chef */}
        <section className=" my-4 py-12 flex flex-col items-center justify-center">
          <h2 className="text-5xl md:text-5xl font-bold tracking-wider uppercase text-neutral-700 my-4">
            Our Special Chefs
          </h2>
          <p className="w-full text-center md:w-[560px] text-base text-neutral-500 my-2">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic,
            commodi repellendus quod tempore reiciendis mollitia perferendis{" "}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full my-6 mt-20">
            <Card className="shadow-lg relative rounded-md border-none  flex flex-col items-center justify-end h-96 md:h-[520px] bg-hero/30">
              <Image
                src="/chef1.png"
                alt="Chef One"
                className="w-full h-full object-contain"
                fill
              />
            </Card>

            <Card className="shadow-lg relative rounded-md border-none  flex flex-col items-center justify-end h-96 md:h-[520px] mt-20 bg-hero/30">
              <Image
                src="/chef3.png"
                alt="Chef One"
                className="w-full h-full object-contain"
                fill
              />
            </Card>

            <Card className="shadow-lg relative rounded-md border-none  flex flex-col items-center justify-end h-96 md:h-[520px] bg-hero/30">
              <Image
                src="/chef2.png"
                alt="Chef One"
                className="w-full h-full object-contain"
                fill
              />
            </Card>
          </div>
        </section>
      </Container>
    </>
  );
};
 
export default HomePage;