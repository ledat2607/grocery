import { db } from "@/lib/firebase";
import { Product } from "@/type-db";
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
  { params }: { params: { storeId: string; productId: string } }
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
      const storeData = store.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Un_authorized", { status: 405 });
      }
    } else {
      return new NextResponse("Store not found", { status: 404 });
    }

    const productRef = doc(db, "stores", params.storeId, "products", params.productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return new NextResponse("product not found", { status: 401 });
    }

    // Update the product
    await updateDoc(productRef, {
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
      updatedAt: serverTimestamp(),
    });

    const updatedproduct = (await getDoc(productRef)).data() as Product;

    return NextResponse.json(updatedproduct);
  } catch (error) {
    console.error("Error in PATCH:", error); // Log the error
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }
    if (!params.productId) {
      return new NextResponse("product not found", { status: 404 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    let storeData = store.data();
    if (storeData?.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 }); // Sử dụng status 403 cho không có quyền truy cập
    }

    const productRef = doc(
      db,
      "stores",
      params.storeId,
      "products",
      params.productId
    );
    const productSnapshot = await getDoc(productRef);

    if (!productSnapshot.exists()) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    await deleteDoc(productRef);

    return new NextResponse("Deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }
    if (!params.productId) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const productRef = doc(db, "stores", params.storeId, "products", params.productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists()) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const productData = productDoc.data() as Product;

    return NextResponse.json(productData);
  } catch (error) {
    console.error("Error fetching product:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
