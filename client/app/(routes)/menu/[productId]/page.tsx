import getProduct from "@/actions/get-product";
import getProducts from "@/actions/get-products";
import Box from "@/components/box";
import Container from "@/components/container";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import Gallery from "./components/gallery/page";
import Info from "./components/Info";

interface ProductDetailProps {
  params: {
    productId: string;
  };
}

const ProductDetail = async ({ params }: ProductDetailProps) => {
  const product = await getProduct(params.productId);
  const suggestedProduct = await getProducts({ category: product.category });
  return (
    <div>
      <Container className="bg-white rounded-lg my-4">
        <Box className="text-neutral-700 text-sm items-center pl-12">
          <Link href={"/"} className="flex items-center gap-2">
            <Home className="w-6 h-6 cursor-pointer" />
            Main page
          </Link>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
          <Link href={"/menu"} className="flex items-center gap-2">
            Product
          </Link>
        </Box>

        <div className="px-4 py-10 sm:px-6 lg:px-8 space-y-10">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-y-8">
            <Gallery image={product.images} />
            <div className="mt-10 px-4 sm:mt-16 sm:px-8 lg:mt-0">
              <Info product={product} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetail;
