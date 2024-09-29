import { UserButton } from "@clerk/nextjs";
import MainNav from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Store } from "@/type-db";

const Navbar = async() => {
    const { userId } = await auth();
    if (!userId) {
      redirect("/sign-in");
    }
    const storeSnap = await getDocs(
      query(collection(db, "stores"), where("userId", "==", userId))
    );
    const store = [] as Store[];
    storeSnap.forEach(doc=>{
        store.push(doc.data() as Store);
    })
    return (
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <StoreSwitcher items={store} />

          <MainNav />
          <div className="ml-auto">
            <UserButton afterSwitchSessionUrl="/" />
          </div>
        </div>
      </div>
    );
}
 
export default Navbar;