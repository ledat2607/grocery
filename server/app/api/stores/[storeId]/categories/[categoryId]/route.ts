import { db } from "@/lib/firebase";
import { Billboards, Category } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Un_authorization", { status: 404 });
    }

    const body = await req.json();

    if (!body) {
      return new NextResponse("Request body is required", { status: 400 });
    }

    const { name, billboardLabel } = body;
    if (!name) {
      return new NextResponse("Category name is required", { status: 402 });
    }
    if (!billboardLabel) {
      return new NextResponse("Billboard is required", { status: 402 });
    }
    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));

    if (store.exists()) {
      const storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un_authorized", { status: 405 });
      }
    } else {
      return new NextResponse("Store not found", { status: 404 });
    }

    const categoryRef = doc(db, "stores", params.storeId, "categories", params.categoryId);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      return new NextResponse("Category not found", { status: 401 });
    }

    // Update the category
    await updateDoc(categoryRef, {
      name,
      billboardLabel,
      updatedAt: serverTimestamp(),
    });

    const updatedCategory = (await getDoc(categoryRef)).data() as Category;

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error in PATCH:", error); // Log the error
    return new NextResponse("Internal server error", { status: 500 });
  }
};


export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 }); 
    }

    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }
    if (!params.categoryId) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    let storeData = store.data();
    if (storeData?.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 }); // Sử dụng status 403 cho không có quyền truy cập
    }

    const categoryRef = doc(
      db,
      "stores",
      params.storeId,
      "categories",
      params.categoryId
    );
    const categorySnapshot = await getDoc(categoryRef);

    if (!categorySnapshot.exists()) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    await deleteDoc(categoryRef);

    return new NextResponse("Deleted successfully", { status: 200 });

  } catch (error) {
    console.error("Error deleting:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

