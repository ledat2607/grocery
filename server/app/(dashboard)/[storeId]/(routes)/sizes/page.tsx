import { format } from "date-fns";
import { Size } from "@/type-db";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SizeColumns } from "./components/columns";
import { SizeClient } from "./components/size-client"

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizeData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "sizes"))
  ).docs.map((doc) => doc.data()) as Size[];

  const formattedSizes: SizeColumns[] = sizeData.map((item) => ({
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
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};
export default CategoriesPage;
