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
    const { name, billboardId } = body;
    console.log(body);
    // Kiểm tra các trường bắt buộc
    if (!name) {
      return new NextResponse("Category name is required", { status: 402 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard is required", { status: 402 });
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
    } else {
      return new NextResponse("Store not found", { status: 404 });
    }

    const billboardRef = await getDoc(
      doc(db, "stores", params.storeId, "billboards", billboardId)
    );

    if (!billboardRef.exists()) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    const billboardData = billboardRef.data();
    const billboardLabel = billboardData?.label;

    const categoryData = {
      name,
      billboardLabel,
      billboardId,
      createdAt: serverTimestamp(),
    };

    // Tạo category mới trong Firestore
    const categoryRef = await addDoc(
      collection(db, "stores", params.storeId, "categories"),
      categoryData
    );
    const id = categoryRef.id;

    // Cập nhật thêm thông tin id và updatedAt
    await updateDoc(doc(db, "stores", params.storeId, "categories", id), {
      ...categoryData,
      id,
      updatedAt: serverTimestamp(),
    });

    // Trả về response với id và dữ liệu của category
    return NextResponse.json({ id, ...categoryData });
  } catch (error) {
    console.error("Error creating category:", error);
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
