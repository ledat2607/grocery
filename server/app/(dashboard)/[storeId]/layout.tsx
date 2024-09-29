import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import { Store } from "@/type-db";
import Navbar from "@/components/navbar";

interface DashboardProps {
  children: React.ReactNode;
  params: { storeId: string };
}

const DashboardLayout = async({ children, params }: DashboardProps) => {
    const {userId} = await auth()
    if(!userId){
        redirect("/sign-in");
    }
    const storeSnap = await getDocs(
      query(
        collection(db, "stores"),
        where("userId", "==", userId),
        where("id", "==", params.storeId)
      )
    );

    let store;

    storeSnap.forEach(doc=>{
        store = doc.data() as Store;
    })
    if(!store){
        redirect("/");
    }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
export default DashboardLayout;

