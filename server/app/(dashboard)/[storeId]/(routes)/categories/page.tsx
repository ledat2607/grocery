import { format } from "date-fns";
import { Billboards, Category } from "@/type-db";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CategoryClient } from "./components/category-client";
import { CategoryColumns } from "./components/columns";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categoryData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
  ).docs.map((doc) => doc.data()) as Category[];

  const formattedBillboards: CategoryColumns[] = categoryData.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboardLabel,
    createdAt: item.createdAt
      ? format(item.createdAt.toDate(), "MMMM do, yyyy")
      : "",
  }));

  return (
    <div className=" flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedBillboards} />
      </div>
    </div>
  );
};
export default CategoriesPage;
