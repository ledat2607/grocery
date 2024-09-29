import { doc, getDoc } from "firebase/firestore";
import { BillboardClient } from "../components/billboard-client";
import { db } from "@/lib/firebase";
import { Billboards } from "@/type-db";
import BillboardForm from "../components/billboard-form";

const Billboard = async ({
  params,
}: {
  params: { billboardId: string; storeId: string };
}) => {
  const billboard = (
    await getDoc(
      doc(db, "stores", params.storeId, "billboards", params.billboardId)
    )
  ).data() as Billboards;
  console.log(billboard);
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};
export default Billboard;