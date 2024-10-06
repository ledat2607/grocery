import { db } from "@/lib/firebase";
import { Billboards, Category, Order, Size } from "@/type-db";
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
  { params }: { params: { storeId: string; orderId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Un_authorization", { status: 404 });
    }
    const body = await req.json();

    const { order_status } = body;

    if (!order_status) {
      return new NextResponse("Order status  is required", { status: 400 });
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

    const orderRef = await getDoc(
      doc(db, "stores", params.storeId, "orders", params.orderId)
    );

    if (orderRef.exists()) {
      await updateDoc(
        doc(db, "stores", params.storeId, "orders", params.orderId),
        {
          ...orderRef.data(),
          order_status,
          updatedAt: serverTimestamp(),
        }
      );
    } else {
      return new NextResponse("Order not found", { status: 404 });
    }

   const order = (
     await getDoc(doc(db, "stores", params.storeId, "orders", params.orderId))
   ).data() as Order;

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error in PATCH:", error); // Log the error
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; orderId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }
    if (!params.orderId) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    let storeData = store.data();
    if (storeData?.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 }); // Sử dụng status 403 cho không có quyền truy cập
    }

    const sizeRef = doc(db, "stores", params.storeId, "orders", params.orderId);
    const sizeSnapshot = await getDoc(sizeRef);

    if (!sizeSnapshot.exists()) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    await deleteDoc(sizeRef);

    return new NextResponse("Deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
