"use client";

import { collection, doc, getDocs } from "firebase/firestore";
import { BillboardClient } from "./components/billboard-client";
import { db } from "@/lib/firebase";
import { Billboards } from "@/type-db";
import { BillboardColumns } from "./components/columns";
import {format} from "date-fns"

const BillBoardPage = async({params}:{params:{storeId:string}}) => {

  const billboardData = (
    await getDocs(collection(doc(db, "stores", params.storeId), "billboards"))
  ).docs.map((doc) => doc.data()) as Billboards[];

    const formattedBillboards: BillboardColumns[] = billboardData.map(
      (item) => ({
        id: item.id,
        imageUrl: item.imageUrl,
        label: item.label,
        createdAt: item.createdAt
          ? format(item.createdAt.toDate(), "MMMM do, yyyy")
          : "",
      })
    ); 

  return (
    <div className=" flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillBoardPage;