import { db } from "@/lib/firebase";
import { Billboards, Category, Size } from "@/type-db";
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
  { params }: { params: { storeId: string; cuisineId: string } }
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

    const { name, value } = body;
    if (!name) {
      return new NextResponse("Cuisine name is required", { status: 402 });
    }
    if (!value) {
      return new NextResponse("Cuisine value is required", { status: 402 });
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

    const CuisineRef = doc(
      db,
      "stores",
      params.storeId,
      "cuisines",
      params.cuisineId
    );
    const CuisineDoc = await getDoc(CuisineRef);

    if (!CuisineDoc.exists()) {
      return new NextResponse("Cuisine not found", { status: 401 });
    }

    // Update the Cuisine
    await updateDoc(CuisineRef, {
      name,
      value,
      updatedAt: serverTimestamp(),
    });

    const updated = (await getDoc(CuisineRef)).data() as Size;

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error in PATCH:", error); // Log the error
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; cuisineId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }
    if (!params.cuisineId) {
      return new NextResponse("Size not found", { status: 404 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    let storeData = store.data();
    if (storeData?.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 }); // Sử dụng status 403 cho không có quyền truy cập
    }

    const cuisineRef = doc(
      db,
      "stores",
      params.storeId,
      "cuisines",
      params.cuisineId
    );
    const cuisineSnapshot = await getDoc(cuisineRef);

    if (!cuisineSnapshot.exists()) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    await deleteDoc(cuisineRef);

    return new NextResponse("Deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
