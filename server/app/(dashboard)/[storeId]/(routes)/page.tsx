import Navbar from "@/components/navbar";
import { db } from "@/lib/firebase";
import { Store } from "@/type-db";
import { doc, getDoc } from "firebase/firestore";

interface DashboardOverviewProps {
  params: { storeId: string };
}

const DashboardOverview = async({ params }: DashboardOverviewProps) => {
    const store = (
      await getDoc(doc(db, "stores", params.storeId))
    ).data() as Store;
  return <div>{store.id}</div>;
};
 
export default DashboardOverview;