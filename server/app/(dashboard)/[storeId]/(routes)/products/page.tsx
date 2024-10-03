import { format } from "date-fns";
import { Product } from "@/type-db";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CuisineClient } from "./components/product-client";
import { ProductColumns } from "./components/columns";
import { formatter } from "@/lib/utils";
import axios from "axios";

const ProductPage = async ({ params }: { params: { storeId: string } }) => {
  const productData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "products"))
  ).docs.map((doc) => doc.data()) as Product[];

  const formattedProduct: ProductColumns[] = productData.map((item) => ({
    id: item.id,
    name: item.name,
    price: formatter.format(item.price),
    isArchived: item.isArchived,
    isFeatured: item.isFeatured,
    category: item.category,
    size: item.size,
    cuisine: item.cuisine,
    discountPrice: formatter.format(item.discountPrice),
    images: item.images,
    qty: item.qty,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));
  return (
    <div className=" flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CuisineClient data={formattedProduct} />
      </div>
    </div>
  );
};
export default ProductPage;
