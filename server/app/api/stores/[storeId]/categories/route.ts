import { db } from "@/lib/firebase";
import { Billboards, Category } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Un_authorization", { status: 404 });
    }
    const body = await req.json();

    const { name, billboardLabel } = body;
    if (!name) {
      return new NextResponse("Category name is required", { status: 402 });
    }
    if (!billboardLabel) {
      return new NextResponse("Billboard is required", {
        status: 402,
      });
    }
    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      let storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un_authorized", { status: 405 });
      }
    }
    const categoryData = {
      name,
      billboardLabel,
      createdAt: serverTimestamp(),
    };

    const categoryRef = await addDoc(
      collection(db, "stores", params.storeId, "categories"),
      categoryData
    );
    const id = categoryRef.id;
    await updateDoc(doc(db, "stores", params.storeId, "categories", id), {
      ...categoryData,
      id,
      updatedAt: serverTimestamp(),
    });
    return NextResponse.json({ id, ...categoryData });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const categoryData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "categories"))
    ).docs.map((doc) => doc.data()) as Category[];

    return NextResponse.json(categoryData);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
};
