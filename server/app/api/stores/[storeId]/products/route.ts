import { db } from "@/lib/firebase";
import { Billboards, Product, Size } from "@/type-db";
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

    const {
      name,
      price,
      discountPrice,
      category,
      size,
      cuisine,
      images,
      isFeatured,
      isArchived,
      qty,
    } = body;
    if (!name) {
      return new NextResponse("Size name is required", { status: 402 });
    }
    if (!images || !images.length) {
      return new NextResponse("Image is required", {
        status: 402,
      });
    }
    if (!price || !discountPrice) {
      return new NextResponse("Price is required", {
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
    const productData = {
      name,
      price,
      discountPrice,
      category,
      size,
      cuisine,
      images,
      isFeatured,
      isArchived,
      qty,
      createdAt: serverTimestamp(),
    };

    const productRef = await addDoc(
      collection(db, "stores", params.storeId, "products"),
      productData
    );
    const id = productRef.id;
    await updateDoc(doc(db, "stores", params.storeId, "products", id), {
      ...productData,
      id,
      updatedAt: serverTimestamp(),
    });
    return NextResponse.json({ id, ...productData });
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

    const sizeData = (
      await getDocs(collection(doc(db, "stores", params.storeId), "products"))
    ).docs.map((doc) => doc.data()) as Product[];

    return NextResponse.json(sizeData);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
};
