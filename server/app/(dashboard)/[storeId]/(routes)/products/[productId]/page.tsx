import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Category, Cuisine, Product, Size } from "@/type-db";
import CuisineForm from "../components/product-form";
import ProductForm from "../components/product-form";

const ProductDetailPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const cuisine = (
    await getDoc(
      doc(db, "stores", params.storeId, "products", params.productId)
    )
  ).data() as Product;

  const categoriesData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
  ).docs.map((doc) => doc.data()) as Category[];

  const cuisineData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "cuisines"))
  ).docs.map((doc) => doc.data()) as Cuisine[];

  const sizeData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "sizes"))
  ).docs.map((doc) => doc.data()) as Size[];


  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={cuisine}
          categories={categoriesData}
          cuisines={cuisineData}
          sizes={sizeData}
        />
      </div>
    </div>
  );
};
export default ProductDetailPage;
