import { format } from "date-fns";
import { Billboards, Category, Cuisine } from "@/type-db";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CuisineClient } from "./components/cuisine-client";
import { CuisineColumns } from "./components/columns";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categoryData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "cuisines"))
  ).docs.map((doc) => doc.data()) as Cuisine[];

  const formattedBillboards: CuisineColumns[] = categoryData.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className=" flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CuisineClient data={formattedBillboards} />
      </div>
    </div>
  );
};
export default CategoriesPage;
