import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Size } from "@/type-db";
import { BillboardColumns } from "../../billboards/components/columns";
import { format } from "date-fns";
import SizeForm from "../components/size-form";

const CategoryDetailPage = async ({
  params,
}: {
  params: { sizeId: string; storeId: string };
}) => {
  const category = (
    await getDoc(doc(db, "stores", params.storeId, "sizes", params.sizeId))
  ).data() as Size;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={category} />
      </div>
    </div>
  );
};
export default CategoryDetailPage;
