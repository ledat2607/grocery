import { db } from "@/lib/firebase";
import { Store } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

//update store
export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Un_authorization", { status: 404 });
    }
    if(!params.storeId){
        return new NextResponse("Store not found", { status: 403 });
    }
    const body = await req.json();

    const { name } = body;
    
    if (!name) {
      return new NextResponse("Store name is required", { status: 402 });
    }

    const docRef = doc(db,'stores',params.storeId)

    await updateDoc(docRef, { name });

    const store = (await getDoc(docRef)).data() as Store;
    
    return NextResponse.json(store);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
};

//DELETE Store
export const DELETE = async (
    req: Request,
    { params }: { params: { storeId: string } }
  ) => {
    try {
      const { userId } = await auth();

      if (!userId) {
        return new NextResponse("Un_authorization", { status: 404 });
      }
      if (!params.storeId) {
        return new NextResponse("Store not found", { status: 403 });
      }

      const docRef = doc(db, "stores", params.storeId);

      await deleteDoc(docRef);

      const store = (await getDoc(docRef)).data() as Store;

      return NextResponse.json({ msg: "Delete successfull" });
    } catch (error) {
      return new NextResponse("Internal server error", { status: 500 });
    }
  };