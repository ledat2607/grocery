import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Un_authorization", { status: 404 });
    }
    const body = await req.json();
    const { name } = body;
    if (!name) {
      return new NextResponse("Store name is required", { status: 402 });
    }
    const storeData = {
      name,
      userId,
      createdAt: serverTimestamp(),
    };
    //add the data to the firestore
    const storeRef = await addDoc(collection(db, "stores"), storeData);
    //get references
    const id = storeRef.id;

    //update doc
    await updateDoc(doc(db, "stores", id), {
      ...storeData,
      id,
      updatedAt: serverTimestamp(),
    });
    return NextResponse.json({ id, ...storeData });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
};
